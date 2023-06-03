const Router = require('express');
const parser = require('./parser');

const router = new Router;

router.get('/prod', parser.loadProd)

module.exports = router;