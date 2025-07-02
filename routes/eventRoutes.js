const express = require('express');
const router = express.Router();
const eventControlller = require('../controller/eventController');
// const { protect, restrictTo } = require("../middlewares/authMiddleware");

// router.use(protect);
// router.use(restrictTo("admin"));
router.get('/events', eventControlller.getEvents);
// router.get('/users/:id', userController.getUser);
router.post('/create-event', eventControlller.createEvent);
router.put('/update-event/:id', eventControlller.updateEvent);
router.delete('/delete-event/:id', eventControlller.deleteEvent);

module.exports = router;
