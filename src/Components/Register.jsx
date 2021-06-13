import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "../utils/customhook";
import { AuthContext } from "../utils/context";
import { useHistory } from "react-router-dom";
function Register(props) {
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const { handleChange, values, onSubmit } = useForm(handleSubmit, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function handleSubmit() {
    addUser();
  }

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        className={`form-container ${loading ? "loading" : ""}`}
      >
        <h1 className="header">Register Input</h1>
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
        <Button primary type="submit" className="custom-button">
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
