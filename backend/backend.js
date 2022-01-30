const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const volleyball = require('volleyball');
const dotenv = require('dotenv');
const { default: monk } = require('monk');
const app = express();
dotenv.config({ path: './.env' });
const port = process.env.PORT;

app.use(volleyball);
app.use(cors());
app.use(express.json());

const db = monk('localhost/elections');
const user = db.get('users');

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().required(),
    address: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    pinCode: Joi.string().required(),
});

app.get('/', (req, res) => {
    res.json({
        message: 'Hello,World!'
    });
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password:text, address, country, state, pinCode } = req.body;
    const password = await bcrypt.hash(text,10);
    try {
        const validUser = await schema.validateAsync({
            firstName,
            lastName,
            email,
            username,
            password,
            address,
            country,
            state,
            pinCode,
        });

        if (validUser) {
            // check if the user already exist
            const userExist = await user.findOne({ email: email });
            // check of username
            const userNameExist = await user.findOne({ username: username });
            if (userExist || userNameExist) {
                return res.status(422).json({
                    message: 'User Already Registered with email or username!'
                })
            }
            // insert the user
            user.insert(validUser);
            return res.status(201).json({
                message: 'User Registered!'
            })
        }

        return res.status(422).json({
            message: 'User Not Registered!'
        })

    } catch (error) {
        res.status(422);
        res.json(error.message);
        console.log(error.message);
    }
});

app.post('/login',async (req,res)=>{
    const {username, password} = req.body;
    try {
        // check the user
        const userPresent = await user.findOne({username:username});

        const userPassPresent = await user.findOne({password:password});

        if(userPresent && userPassPresent){
            const token = await jwt.sign({id:userPresent._id},process.env.SECRET_KEY)
            console.log(token);
            return res.status(201).json({
                message:'Continue to Login'
            })
        }
        return res.status(422).json({
            message:'Invalid username or password!'
        })
    } catch (error) {
        res.status(422);
        res.json({
            message:error.mmessage
        });
    }

})

app.listen(port, () => {
    console.log(`Listening at http://locathost:${port}`);
});
