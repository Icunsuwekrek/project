const express = require('express');
const router = express.Router();
const bannerController = require('../controller/bannerController');
const upload = require("../middlewares/uploadMiddleware")
// const { protect, restrictTo } = require("../middlewares/authMiddleware");

// router.use(protect);
// router.use(restrictTo("admin"));
router.get('/banners', bannerController.getBanners);
// router.get('/users/:id', userController.getUser);
router.post('/create-banner',upload.single('image'), bannerController.createBanner);
// router.put('/update-event/:id', bannerController.updateEvent);
// router.delete('/delete-event/:id', bannerController.deleteEvent);

module.exports = router;
