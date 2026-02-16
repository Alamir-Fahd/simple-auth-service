const { findUser } = require("./users");

function login(username, password) {
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string' || username.trim() === "") {
    return { success: false, message: "Invalid input" };
  }

  const user = findUser(username);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (user.password !== password) {
    return { success: false, message: "Invalid password" };
  }

  return {
    success: true,
    message: "Login successful",
    role: user.role
  };
}

module.exports = { login };
