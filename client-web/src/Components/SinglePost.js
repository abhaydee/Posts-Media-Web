import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import React, { useContext, useState } from "react";
import {
  Card,
  Grid,
  Image,
  Button,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";
import { AuthContext } from "../utils/context";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";
import Avatar from "../images/avatar.jpg";
function SinglePost(props) {
  const postId = props.match.params.postId;
  console.log("the post id", postId);
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const { data } = useQuery(FETCH_SINGLE_POST, {
    variables: {
      postId,
    },
  });
  const [submitComment] = useMutation(CREATE_COMMENT, {
    update() {
      setComment("");
    },
    variables: {
      postId,
      body: comment,
    },
  });
  const deletePostCallback = () => {
    console.log("arriving after delete");
    props.history.push("/");
  };
  let PostMarkup;
  if (!data?.getPost) {
    PostMarkup = <div>Loading Post....</div>;
  } else {
    const { id, body, createdAt, username, comments, likes } = data?.getPost;
    PostMarkup = (
      <Grid style={{ margin: 20 }}>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image floated="right" size="small" src={Avatar} />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, username }} />
                <Button
                  color="teal"
                  basic
                  onClick={() => console.log("comment on post")}
                >
                  <Icon name="comments" />
                </Button>
                <Label as="a" basic color="teal" pointing="left">
                  0
                </Label>
                {user && user.username === username && (
                  <DeleteButton
                    postId={id}
                    deleteCallback={deletePostCallback}
                  />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        placeholder="Enter the comment here..."
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        name="comment"
                        type="text"
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return PostMarkup;
}

const FETCH_SINGLE_POST = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
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
const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
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

export default SinglePost;
