const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', bookingController.getAllBookings);
router.get('/:bookingId', bookingController.getBookingById);
router.post('/', bookingController.createBooking);

// Optional routes
router.put('/:bookingId', bookingController.updateBooking);
router.delete('/:bookingId', bookingController.deleteBooking);

module.exports = router;
