import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../utils/customhook";

function PostForm() {
  const { handleChange, values, onSubmit } = useForm(createPostCallback, {
    body: "",
  });
  const [addPost, { error }] = useMutation(ADD_POST_MUTATION, {
    variables: values,
    update(_, result) {
      console.log("the result", result);
    },
  });
  function createPostCallback() {
    addPost();
  }

  return (
    <Form onSubmit={onSubmit}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi World!"
          name="body"
          onChange={handleChange}
          value={values.body}
        />
        <Button color="teal" type="submit">
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
}

const ADD_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
    }
  }
`;

export default PostForm;
