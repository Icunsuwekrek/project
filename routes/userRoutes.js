const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect); 
router.put('/users/:id', upload.single('profile'), userController.updateUser);

router.use(restrictTo('admin'));

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser);
router.post('/users', upload.single('profile'), userController.createUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
