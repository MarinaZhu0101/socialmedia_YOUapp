const express = require('express');
const router = express.Router();
const LikeController = require('../controllers/LikeController');
const { validateToken } = require('../middlewares/Authmiddleware');


router.post("/", validateToken, LikeController.toggleLike);

module.exports = router;