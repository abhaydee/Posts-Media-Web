const registerValidation = (email, username, password, confirmPassword) => {
  console.log("second email", email);

  let errors = {};
  if (username.trim() === "") {
    errors.username = "username cannot be empty";
  }
  if (email === "") {
    errors.email = "email cannot be empty";
  }
  if (password === "") {
    errors.password = "Password cannot be empty";
  } else if (password !== confirmPassword) {
    console.log(
      "the password and the confirmed one",
      password,
      confirmPassword
    );
    errors.confirmPassword = "Password dont match";
  }
  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true,
  };
};

const loginValidation = (email, password) => {
  let errors = {};
  if (email.trim() === "") {
    errors.username = "email cannot be empty";
  }
  if (password === "") {
    errors.password = "password cannot be empty";
  }
  console.log("the errors returning", errors);
  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true,
  };
};

module.exports = {
  registerValidation,
  loginValidation,
};
