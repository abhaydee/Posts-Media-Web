import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { FETCH_POSTS } from "./Home";

function DeleteButton({ postId, deleteCallback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePost, { loading }] = useMutation(DELETE_MUTATION, {
    variables: {
      postId,
    },
    update(proxy) {
      setConfirmOpen(false);
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
