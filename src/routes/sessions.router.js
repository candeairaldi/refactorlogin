import express from 'express';
import userModel from '../dao/models/user.model.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !age || !password) {
            throw new Error('Faltan campos obligatorios');
        }
        const user = await userModel.create({ first_name, last_name, email, age, password });
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Faltan campos obligatorios');
        }
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = { first_name: 'Admin', role: 'admin' };
        } else {
            const user = await userModel.findOne({ email, password });
            if (!user) {
                throw new Error('Usuario o contraseña incorrectos');
            }
            req.session.user = { first_name: user.first_name, last_name: user.last_name, email: user.email, age: user.age, role: 'user' };
        }
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

export default router;