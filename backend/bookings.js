const { v4: uuidv4 } = require("uuid");

let bookings = [];

const isOverlapping = (start, end) => {
  return bookings.some(b =>
    new Date(start) < new Date(b.endTime) &&
    new Date(end) > new Date(b.startTime)
  );
};

exports.getAllBookings = (req, res) => {
  res.json(bookings);
};

exports.getBookingById = (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
};

exports.createBooking = (req, res) => {
  const { userId, startTime, endTime } = req.body;

  if (!userId || !startTime || !endTime)
    return res.status(400).json({ error: "Missing required fields" });

  const start = Date.parse(startTime);
  const end = Date.parse(endTime);

  if (isNaN(start) || isNaN(end) || start >= end)
    return res.status(400).json({ error: "Invalid date range" });

  if (isOverlapping(startTime, endTime))
    return res.status(409).json({ error: "Time slot already booked" });

  const booking = {
    id: uuidv4(),
    userId,
    startTime,
    endTime,
  };

  bookings.push(booking);
  res.status(201).json(booking);
};
