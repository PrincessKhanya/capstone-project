module.exports.getResponse = function (statusCode, messageData) {
  return { status: statusCode, message: messageData };
};
