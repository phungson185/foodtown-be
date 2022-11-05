const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsor');
const auth = require('../middlewares/auth');
const multer = require("multer");

const imageUpload = multer({
    limits: {
        fileSize: 1e12,
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|bmp|jpe?g)$/i)) {
            return cb(new Error("file must be image format"));
        }
        cb(null, true);
    },
});

router.post('/', auth, imageUpload.single('logo'), async (req, res) => {
    const { name } = req.body;
    const logo = req.file;
    try {
        const result = await sponsorController.addSponsor({name, logo});
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

router.get('/', async (req, res) => {
    try {
        const result = await sponsorController.getAllSponsors();
        res.status(200).send({message: "success", result}); 
    } catch (error) {
        res.status(400).send({message: "failure", error});
    }
})

module.exports = router;