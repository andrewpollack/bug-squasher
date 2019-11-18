const crypto = require('crypto');

/*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 *      salt - The salt used for the password.
 *      hash - The hash of the password and salt
 */
module.exports.makePasswordEntry = function makePasswordEntry(clearTextPassword) {
    var passwordEntry = {salt:"", hash:""};
    const hashFn = crypto.createHash('sha256');

    var randInt = Math.floor(Math.random() * 100) + 1;
    var passWithSalt = (clearTextPassword + randInt);

    hashFn.update(passWithSalt);
    passwordEntry.hash = hashFn.digest('hex');
    passwordEntry.salt = randInt;
    return passwordEntry;
}

/*
 * Return true if the specified clear text password
 * and salt generates the specified hash.
 * @param {string} hash
 * @param {number} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
module.exports.doesPasswordMatch = function doesPasswordMatch(hash, salt, clearTextPassword) {
    const hashFn = crypto.createHash('sha256');

    var passWithSalt = (clearTextPassword + salt);

    hashFn.update(passWithSalt);
    var newHash = hashFn.digest('hex');

    if(newHash === hash) {
        return true;
    }
    else {
        return false
    }
}