const crypto = require('crypto');

function computeHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

module.exports = { computeHash };
