import express from 'express';
import { ProductsManagerDB } from '../dao/products.manager.DB.js';
import { CartsManagerDB } from '../dao/carts.manager.DB.js';

const router = express.Router();

const checkSession = (req, res, next) => {
    if (!req.session.user && (req.originalUrl === '/register' || req.originalUrl === '/login')) {
        next();
    } else if (req.session.user && (req.originalUrl === '/register' || req.originalUrl === '/login')) {
        res.redirect('/products');
    } else if (!req.session.user && (req.originalUrl === '/profile' || req.originalUrl === '/products' || req.originalUrl.startsWith('/carts/'))) {
        res.redirect('/login');
    } else {
        next();
    }
};

router.use(checkSession);

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login', {
        style: 'login.css'
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        style: 'register.css'
    });
});

router.get('/profile', (req, res) => {
    const user = req.session.user;
    res.render('profile', {
        style: 'profile.css',
        user
    });
});

router.get('/products', async (req, res) => {
    const user = req.session.user;
    try {
        const products = await ProductsManagerDB.getInstance().getProducts(req);
        res.render('products', {
            style: 'products.css',
            user,
            products
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/carts/:cid', async (req, res) => {
    const id = req.params.cid;
    try {
        const cart = await CartsManagerDB.getInstance().getCartById(id);
        cart.products = cart.products.map(product => {
            return {
                ...product,
                total: product.product.price * product.quantity
            };
        });
        cart.total = cart.products.reduce((acc, product) => acc + product.total, 0).toFixed(2);
        res.render('carts', {
            style: 'carts.css',
            cart
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;