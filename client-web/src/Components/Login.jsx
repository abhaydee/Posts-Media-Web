import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "../utils/customhook";
function Login(props) {
  const [errors, setErrors] = useState({});
  console.log("the errors", errors);
  const { handleChange, values, onSubmit } = useForm(handleSubmit, {
    email: "",
    password: "",
  });
  console.log("the values passed", values);
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      console.log("the result", result);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function handleSubmit() {
    loginUser();
  }

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        className={`form-container ${loading ? "loading" : ""}`}
      >
        <h1 className="header">Login Input</h1>
        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          autoComplete="off"
          error={errors.email ? true : false}
          value={values.email}
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
        <Button primary type="submit">
          Login
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

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      id
      email
      token
      username
      createdAt
    }
  }
`;
export default Login;
