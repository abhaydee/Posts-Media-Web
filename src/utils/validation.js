const registerValidation = (email, username, password, confirmPassword) => {
  console.log("second email", email);

  let errors = {};
  if (username.trim() === "") {
    errors.username = "username cannot be empty";
  }
  if (email === "") {
    errors.email = "email cannot be empty";
  }
  // else {
  //   let regExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   if (!email.match(regExpression)) {
  //     errors.email = "Please use a valid email";
  //   }
  // }
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
