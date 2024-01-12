function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('errorMessage');

    if (username === 'Presidency_University' || password === '123456') {
        // Redirect to a dashboard or home page on successful login
        window.location.href = '../html/issuer.html';
    } else {
        errorMessageElement.textContent = 'Invalid username or password';
    }
}


function register(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'Presidency_University' || password === '123456') {
        // Redirect to a dashboard or home page on successful login
        alert("Register Successful")
        location.reload();
    } else {
        errorMessageElement.textContent = 'Invalid username or password';
    }
}