exports.validateBookingData = (bookingData) => {
  const { userId, startTime, endTime } = bookingData;
  
  // Check required fields
  if (!userId) return 'User ID is required';
  if (!startTime) return 'Start time is required';
  if (!endTime) return 'End time is required';
  
  // Validate date strings
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  
  if (isNaN(startDate.getTime())) return 'Invalid start time format';
  if (isNaN(endDate.getTime())) return 'Invalid end time format';
  
  // Check if end time is after start time
  if (endDate <= startDate) {
    return 'End time must be after start time';
  }
  
  // Check if booking is in the past
  if (startDate < new Date()) {
    return 'Cannot book in the past';
  }
  
  return null;
};

exports.checkBookingConflicts = (bookings, startTime, endTime) => {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  
  // Check for conflicts with existing bookings
  const conflict = bookings.find(booking => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    
    // Check if there is an overlap
    return (
      (startDate >= bookingStart && startDate < bookingEnd) || // New booking starts during existing booking
      (endDate > bookingStart && endDate <= bookingEnd) || // New booking ends during existing booking
      (startDate <= bookingStart && endDate >= bookingEnd) // New booking encompasses existing booking
    );
  });
  
  if (conflict) {
    return `Booking conflicts with existing booking (ID: ${conflict.id})`;
  }
  
  return null;
};