import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import MyPopup from "./MyPopup";

function LikeButton({ post: { id, likes, username }, user }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((likes) => likes.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {
      postId: id,
    },
  });
  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <>
      <MyPopup content={liked ? "Unlike Post.." : "Like Post.."}>
        <Button as="div" labelPosition="right" onClick={likePost}>
          {likeButton}
          <Label as="a" basic color="teal" pointing="left">
            0
          </Label>
        </Button>
      </MyPopup>
    </>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
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

export default LikeButton;
