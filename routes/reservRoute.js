const express = require('express');
const router = express.Router();
const reservController = require('../controller/reservationController');

router.get('/reserv', reservController.getReservations);
// router.get('/users/:id', userController.getUser);
router.post('/create-reserv', reservController.createReservation);
// router.put('/update-class/:id', classController.updateClass);
router.delete('/delete-reserv/:id', reservController.deleteReservation);

module.exports = router;
