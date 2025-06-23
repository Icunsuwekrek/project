const express = require('express');
const router = express.Router();
const tiketController = require('../controller/ticketController');

router.get('/tiket', tiketController.getTickets);
// router.get('/users/:id', userController.getUser);
router.post('/create-tiket', tiketController.createTicket);
router.put('/update-tiket/:id', tiketController.updateTicket);
router.delete('/delete-tiket/:id', tiketController.deleteTicket);

module.exports = router;
