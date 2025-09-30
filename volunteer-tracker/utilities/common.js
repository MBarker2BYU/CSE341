// Validation helper functions
exports.isValidEmail = function (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

exports.isValidPhoneNumber = function (phoneNumber) {
    const phoneRegex = /^\(?[0-9]{3}\)?[-.]?[0-9]{3}[-.]?[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
};

exports.isValidAccountType = function (accountType) {
    return ['student', 'organizer', 'admin'].includes(accountType);
};

exports.isStrongPassword = function (password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return passwordRegex.test(password);
};

exports.isValidDate = function (date) {
    return !isNaN(Date.parse(date));
};

exports.isValidTime = function (time) {
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(time);
};

exports.isValidDuration = function (duration) {
    return typeof duration === 'number' && duration >= 0;
};

// Response helper functions
exports.formattedResponse = function (res, code, message, data) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(code).json({ message: message, data: data });
};

exports.formattedErrorResponse = function (res, code, message, error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(code).json({ message: message, error: error.message });
};

module.exports = {
    isValidEmail: exports.isValidEmail,
    isValidPhoneNumber: exports.isValidPhoneNumber,
    isValidAccountType: exports.isValidAccountType,
    isStrongPassword: exports.isStrongPassword,
    isValidDate: exports.isValidDate,
    isValidTime: exports.isValidTime,
    isValidDuration: exports.isValidDuration,
    formattedResponse: exports.formattedResponse,
    formattedErrorResponse: exports.formattedErrorResponse
};