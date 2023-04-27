exports.formattedDate = function () {
    var dateOptions = {};
    dateOptions.year = dateOptions.month = dateOptions.day = dateOptions.hour = dateOptions.minute = dateOptions.second = 'numeric'
    return new Date().toLocaleString('sv-SE', dateOptions)
}