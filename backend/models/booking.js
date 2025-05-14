class Booking {
  constructor(id, userId, startTime, endTime) {
    this.id = id;
    this.userId = userId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.createdAt = new Date();
  }
}

module.exports = Booking;