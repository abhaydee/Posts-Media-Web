import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";

function DeleteButton({ postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePost, { loading }] = useMutation(DELETE_MUTATION, {
    variables: {
      postId,
    },
    update(proxy, result) {
      setConfirmOpen(false);
      callback();
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
            onConfirm={deletePost}
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
export default DeleteButton;
