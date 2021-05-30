import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { FETCH_POSTS } from "./Home";

function DeleteButton({ postId, deleteCallback, commentId }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const Mutation = commentId ? DELETE_COMMENT : DELETE_MUTATION;
  const [deletePostOrMutation, { loading }] = useMutation(Mutation, {
    variables: {
      postId,
      commentId,
    },
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const { data } = proxy.readQuery({
          query: FETCH_POSTS,
        });
        console.log("the data", data);
        let tempData;
        if (data) {
          tempData = data && data;
          console.log("the tempdata", tempData);
          tempData.getPosts = tempData?.getPosts.filter(
            (post) => post.id !== postId
          );
        }
        proxy.writeQuery({
          query: FETCH_POSTS,
          data: {
            ...tempData,
            getPosts: {
              tempData,
            },
          },
        });
        deleteCallback();
      }
    },
  });
  return (
    <>
      {loading ? (
        <div>Deleting Post....</div>
      ) : (
        <>
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
          <Confirm
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={deletePostOrMutation}
          />
        </>
      )}
    </>
  );
}

const DELETE_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: String!) {
    deleteComment(postId: $postId, commentId: $commentId) {
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

export default DeleteButton;
