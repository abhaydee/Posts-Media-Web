import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";

function Register() {
  const [values, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = () => {};
  const handleChange = (event) => {
    setValue({
      ...values,
      [event.target.name]: [event.target.value],
    });
  };
  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <h1>Register Input</h1>
      <Form.Input
        label="Username"
        placeholder="Username"
        name="username"
        value={values.username}
        onChange={handleChange}
      ></Form.Input>
      <Form.Input
        label="Email"
        placeholder="Email"
        value={values.email}
        name="email"
        onChange={handleChange}
      ></Form.Input>
      <Form.Input
        label="Password"
        placeholder="password"
        value={values.password}
        name="password"
        onChange={handleChange}
      ></Form.Input>
      <Form.Input
        label="Confirm Password"
        placeholder="Confirm Password"
        value={values.confirmPassword}
        name="confirmPassword"
        onChange={handleChange}
      ></Form.Input>
      <Button primary type="submit">
        Register
      </Button>
    </Form>
  );
}

export default Register;
