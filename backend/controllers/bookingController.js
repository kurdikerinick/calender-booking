
// controllers/bookingController.js
const Booking = require('../models/booking');
const { validateBookingData, checkBookingConflicts } = require('../utils/validation');

// In-memory store for bookings (replace with database in production)
let bookings = [];
let lastId = 0;

exports.getAllBookings = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      bookings
    }
  });
};

exports.getBookingById = (req, res) => {
  const { bookingId } = req.params;
  const booking = bookings.find(b => b.id === bookingId);
  
  if (!booking) {
    return res.status(404).json({
      status: 'fail',
      message: 'Booking not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
};

exports.createBooking = (req, res) => {
  try {
    // Validate booking data
    const validationError = validateBookingData(req.body);
    if (validationError) {
      return res.status(400).json({
        status: 'fail',
        message: validationError
      });
    }
    
    const { userId, startTime, endTime } = req.body;
    
    // Check for booking conflicts
    const conflictError = checkBookingConflicts(bookings, startTime, endTime);
    if (conflictError) {
      return res.status(409).json({
        status: 'fail',
        message: conflictError
      });
    }
    
    // Create new booking
    const newBooking = new Booking(
      String(++lastId),
      userId,
      new Date(startTime),
      new Date(endTime)
    );
    
    bookings.push(newBooking);
    
    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateBooking = (req, res) => {
  const { bookingId } = req.params;
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Booking not found'
    });
  }
  
  // Validate booking data
  const validationError = validateBookingData(req.body);
  if (validationError) {
    return res.status(400).json({
      status: 'fail',
      message: validationError
    });
  }
  
  const { userId, startTime, endTime } = req.body;
  
  // Check for booking conflicts (excluding the current booking)
  const otherBookings = bookings.filter(b => b.id !== bookingId);
  const conflictError = checkBookingConflicts(otherBookings, startTime, endTime);
  if (conflictError) {
    return res.status(409).json({
      status: 'fail',
      message: conflictError
    });
  }
  
  // Update booking
  const updatedBooking = new Booking(
    bookingId,
    userId,
    new Date(startTime),
    new Date(endTime)
  );
  
  bookings[bookingIndex] = updatedBooking;
  
  res.status(200).json({
    status: 'success',
    data: {
      booking: updatedBooking
    }
  });
};

exports.deleteBooking = (req, res) => {
  const { bookingId } = req.params;
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Booking not found'
    });
  }
  
  bookings.splice(bookingIndex, 1);
  
  res.status(204).send();
};