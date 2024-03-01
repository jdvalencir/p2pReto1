import axios from "axios";

function login(req, res) {
    const { username } = req.body;
    if (!username) {
        return res.status(400).send('Username is required');
    }
    return res.status(200).send('Login success');
}

function logout(req, res) {
    res.send('Logout');
}

export default {
    login,
    logout
}