import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
function Register(props) {
  const [values, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  console.log("the errors", errors);
  const handleChange = (event) => {
    setValue({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  console.log("the values passed", values);
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      console.log("the result", result);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });
  const handleSubmit = () => {
    addUser();
  };
  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        className={`form-container ${loading ? "loading" : ""}`}
      >
        <h1>Register Input</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          type="text"
          autoComplete="off"
          error={errors.username ? true : false}
          value={values.username}
          onChange={handleChange}
        ></Form.Input>
        <Form.Input
          label="Email"
          placeholder="Email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          name="email"
          autoComplete="off"
          onChange={handleChange}
        ></Form.Input>
        <Form.Input
          label="Password"
          placeholder="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          autoComplete="off"
          name="password"
          onChange={handleChange}
        ></Form.Input>
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          value={values.confirmPassword}
          name="confirmPassword"
          type="password"
          autoComplete="off"
          error={errors.confirmPassword ? true : false}
          onChange={handleChange}
        ></Form.Input>
        <Button primary type="submit">
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message error-container">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      input: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      token
      username
      createdAt
    }
  }
`;
export default Register;
