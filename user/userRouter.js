const Router = require('express');

const controller = require('./userController');

const router = new Router;

router.get('/get', controller.getUsers);
router.post('/select/:id', controller.selectUser);
router.post('/remove/:id', controller.removeUser);

module.exports = router;