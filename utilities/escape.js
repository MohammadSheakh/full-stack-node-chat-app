const escape = function (str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); // regular expression er jonno jegula use hoy
    // shegula ke escape kore diyeche .. tate regular expression er shathe ar kono conflict hobe na ..
};

module.exports = escape;
