const express = require('express');
const router = express.Router();
const classController = require('../controller/classController');

router.get('/class', classController.getClasses);
// router.get('/users/:id', userController.getUser);
router.post('/create-class', classController.createClass);
router.put('/update-class/:id', classController.updateClass);
router.delete('/delete-class/:id', classController.deleteClass);

module.exports = router;
