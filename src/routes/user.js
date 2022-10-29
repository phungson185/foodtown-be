const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signup', (req, res) => {
    const user = req.body;
    try {
        const result = userController.createUser(user);
        res.status(201).send({message: "Success", result});
    } catch (error) {
        res.status(401).send({message: "Failure", error});
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { admin } = req.query;
    console.log({email, password, admin});
    try {
        const result = await userController.login(email, password, admin);
        if (result?.error) {
            throw result.error;
        }
        res.status(201).send({message: "Success", result});
    } catch (error) {
        res.status(401).send({message: "Failure", error});
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        const result = await userController.logout(req.user, req.token);
        res.status(201).send({message: "Success", result});
    } catch (error) {
        res.status(401).send({message: "Failure", error});
    }
})

router.get('/', auth, async (req, res) => {
    try {
        res.status(200).send({message: "Success", result: {
            _id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            token: req.token,
            role: req.user.role,
        }});
    } catch (error) {
        res.status(400).send({message: "Failure", error});
    }
});

// router.get('/', auth, async (req, res) => {
//     try {
//         const result = await userController.getAllUsers();
//         console.log(result);
//         res.status(200).send({message: "Success", result});
//     } catch (error) {
//         res.status(400).send({message: "Failure", error});
//     }
// });

// router.get('/')

module.exports = router;