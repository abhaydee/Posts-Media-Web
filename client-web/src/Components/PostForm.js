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
  const [addPost] = useMutation(ADD_POST_MUTATION, {
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
    <>
      <Form onSubmit={onSubmit}>
        <h2 className="post-header">Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={handleChange}
            value={values.body}
            autoComplete="off"
            error={values.body.trim() === "" ? true : false}
            className="form-input"
          />
          <Button color="teal" type="submit" className="submit-button">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {values.body.trim() === "" && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>Post Body cannot be empty</li>
          </ul>
        </div>
      )}
    </>
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
