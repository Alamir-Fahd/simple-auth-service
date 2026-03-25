function login(username, password) {
  if (!username || !password) {
    return { success: false, message: "Invalid input" };
  }
  if (password.length < 8) {
    return { success: false, message: "Invalid credentials" };
  }
  if (username === "admin" && password === "securePassword123") {
    return { success: true };
  }
  return { success: false, message: "Invalid credentials" };
}

module.exports = { login };
