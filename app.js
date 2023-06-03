const db = require('./db/dbConfig');

const express = require('express');
const cors = require('cors');
const bp = require('body-parser');

const parser = require('./parser/parserRouter');
const order = require('./order/orderRouter');
const users = require('./user/userRouter');

const PORT = 5000;

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(bp.json());

app.use("/get", parser);
app.use("/order", order);
app.use("/users", users);

app.listen(PORT, () => { console.log('work') });