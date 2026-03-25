export const usernameValidator = (username) => {
  const value = String(username || "").trim();

  if (value.length < 3 || value.length > 24) {
    return {
      isValid: false,
      errorMessage: "Username must be 3-24 characters",
    };
  }

  if (!/^[a-zA-Z0-9_@.]+$/.test(value)) {
    return {
      isValid: false,
      errorMessage: "Only letters, numbers, _, @ and . are allowed",
    };
  }
};