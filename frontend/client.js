const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const firstName = formData.get('firstName')
    const lastName = formData.get('lastName')
    const email = formData.get('email')
    const username = formData.get('userName')
    const password = formData.get('password')
    const address = formData.get('address')
    const country = formData.get('country')
    const state = formData.get('state')
    const pinCode = formData.get('pinCode')

    const data = {
        firstName,
        lastName,
        email,
        username,
        password,
        address,
        country,
        state,
        pinCode
    };
    console.log(data);
    form.reset();

    const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.json();

})