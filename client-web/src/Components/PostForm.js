import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../utils/customhook";
import { FETCH_POSTS } from "../Components/Home";
function PostForm() {
  const { handleChange, values, onSubmit } = useForm(createPostCallback, {
    body: "",
  });
  const [addPost, { error }] = useMutation(ADD_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS,
      });
      let tempData = [data.getPosts];
      tempData = [result.data.createPost, tempData];
      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          ...data,
          getPosts: {
            tempData,
          },
        },
      });
      values.body = "";
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
          autoComplete="off"
        />
        <Button color="teal" type="submit">
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
}

export const ADD_POST_MUTATION = gql`
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
