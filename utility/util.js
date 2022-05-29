let isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!!email && typeof email === "string" && email.match(emailRegex)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    isValidEmail
}
