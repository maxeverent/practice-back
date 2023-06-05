const db = require('./db/dbConfig');

const express = require('express');
const cors = require('cors');
const bp = require('body-parser');

const parser = require('./parser/parserRouter');
const orders = require('./order/ordersRouter');
const users = require('./user/userRouter');

const currentOrder = require('./currentOrder/currentOrderRouter')

const PORT = 5000;

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(bp.json());

app.use('/parser', parser);
app.use('/current_order', currentOrder);
app.use('/orders', orders);
app.use("/users", users);

app.listen(PORT, () => { console.log('work') });