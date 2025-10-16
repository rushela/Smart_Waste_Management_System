class NotFoundError extends Error {
  constructor(message, metadata = {}) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
    this.metadata = metadata;
  }
}

module.exports = {
  NotFoundError
};
