/**
 * Checks for the appropriate status code in a response
 * @param status The status string
 * @returns {number} The appropriate HTTP code
 */
module.exports = function (status) {
  switch (status) {
    case 'success':
      return 200;
    case 'created':
      return 201;
    case 'rejected':
      return 400;
    case 'not_found':
      return 404;
    case 'duplicate':
      return 409;
    default:
      return 500;
  }
};
