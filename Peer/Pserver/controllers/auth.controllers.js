function login(req, res) {
    res.send('Login');
}

function logout(req, res) {
    res.send('Logout');
}

export default {
    login,
    logout
}