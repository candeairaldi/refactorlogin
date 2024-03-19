import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js';
import mongoose from 'mongoose';

const PORT = 8080;
const URI = 'mongodb+srv://candeairaldi:c4740930@codercluster.hd6bor0.mongodb.net/desafio5?retryWrites=true&w=majority&appName=CoderCluster';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
//app.set('views', path.join(__dirname, 'views'));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(session({
    store: MongoStore.create({
        mongoUrl: URI,
        ttl: 900
    }),
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

mongoose.connect(URI)
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.log('Database connection error', error);
    });