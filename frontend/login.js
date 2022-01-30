const form = document.querySelector('form');

form.addEventListener('submit',async (event)=>{
    event.preventDefault();
    
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    
    const data = {
        username,
        password
    };

    const response = await fetch('http://localhost:5000/login',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    });
    form.reset();
    return response.json();

})