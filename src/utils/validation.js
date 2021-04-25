const registerValidation = (email, username, password, confirmPassword) => {
  let errors = {};
  if (username.trim() === "") {
    errors.username = "username cannot be empty";
  }
  if (email.trim() === "") {
    errors.email = "email cannot be empty";
  } else {
    let regExpression = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regExpression)) {
      errors.email = "Please use a valid email";
    }
  }
  if (password === "") {
    errors.password = "Password cannot be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password dont match";
  }
  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true,
  };
};

const loginValidation = (username, password) => {
  let errors = {};
  if (username.trim() === "") {
    errors.username = "username cannot be empty";
  }
  if (password === "") {
    errors.password = "password cannot be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true,
  };
};

module.exports = {
  registerValidation,
  loginValidation,
};
