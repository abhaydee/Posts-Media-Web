import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import React, { useContext } from "react";
import { Card, Grid, Image, Button, Icon, Label } from "semantic-ui-react";
import { AuthContext } from "../utils/context";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const {
    data: { getPost },
  } = useQuery(FETCH_SINGLE_POST, {
    variables: {
      postId,
    },
  });
  const deletePostCallback = () => {
    props.history.push("/");
  };
  let PostMarkup;
  if (!getPost) {
    PostMarkup = <div>Loading Post....</div>;
  } else {
    const { id, body, createdAt, username, comments, likes } = getPost;
    PostMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
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
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
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
export default SinglePost;
