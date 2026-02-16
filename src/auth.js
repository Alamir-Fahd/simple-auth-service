const { findUser } = require("./users");

function login(username, password) {
  
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string' || username.trim() === "") {
    return { success: false, message: "Invalid input" };
  }
  
  if (password.length < 8) {
    console.log(`[AUDIT] Failed login attempt: ${username} - Reason: Invalid credentials - Timestamp: ${new Date().toISOString()}`);
    return { success: false, message: "Invalid credentials" }; 
  }

  const user = findUser(username);
  if (!user) {
    console.log(`[AUDIT] Failed login attempt: ${username} - Reason: Invalid credentials - Timestamp: ${new Date().toISOString()}`);
    return { success: false, message: "Invalid credentials" };
  }

  if (user.password !== password) {
    console.log(`[AUDIT] Failed login attempt: ${username} - Reason: Invalid credentials - Timestamp: ${new Date().toISOString()}`);
    return { success: false, message: "Invalid credentials" };
  }

  return {
    success: true,
    message: "Login successful",
    role: user.role
  };
}

module.exports = { login };

