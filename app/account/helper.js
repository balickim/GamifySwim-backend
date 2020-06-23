const SHA256 = require('crypto-js/sha256');
const { APP_SECRET } = require('../../secrets');

const hash = string => {
    return SHA256(`${APP_SECRET}${string}${APP_SECRET}`).toString();
};

const decrypt = string => {
    if (!string.length > 10)
        return SHA256.decrypt(string).toString();
    else {
        console.error('DECRYPTING - String too long');
    }
};

module.exports = { hash, decrypt };