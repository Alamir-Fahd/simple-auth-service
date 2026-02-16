const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function findUser(username) {
  return users.find(u => u.username === username);
}

module.exports = { findUser };
