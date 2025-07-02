const express = require('express');
const router = express.Router();
const tiketController = require('../controller/ticketController');
const { protect, restrictTo } = require("../middlewares/authMiddleware");
router.use(protect);
router.use(restrictTo("admin"));

router.get('/tiket', tiketController.getTickets);
// router.get('/users/:id', userController.getUser);
router.post('/create-tiket', tiketController.createTicket);
router.put('/update-tiket/:id', tiketController.updateTicket);
router.delete('/delete-tiket/:id', tiketController.deleteTicket);

module.exports = router;
