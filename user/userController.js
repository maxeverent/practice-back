const db = require('../db/dbConfig');

class userController {
    getUsers = async (req, res) => {
        try {
            const users = await db.select("*").from("user");
            return res.status(200).json(users);
        } catch(e) {
            return res.status(400).json("err");
        }        
    };

    selectUser = async (req, res) => {
        try {
            const { id } = req.params;
            await db('user').where('id', '=', id).update('is_selected', true);
            return res.status(200).json('ok')    
        } catch(e) {
            return res.status(400).json('err')
        }
    };
    
    removeUser = async (req, res) => {
        try {
            const { id } = req.params;
            await db('user').where('id', '=', id).update('is_selected', false);
            return res.status(200).json('ok')    
        } catch(e) {
            return res.status(400).json('err')
        }
    };
};

module.exports = new userController();