class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //to cal const of the base class and it will add message property
    this.code = errorCode;
  }
}

module.exports = HttpError;
