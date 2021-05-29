import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon, Image, Label } from "semantic-ui-react";
import { AuthContext } from "../utils/context";
import LikeButton from "./LikeButton";
function PostCard({
  post: { body, createdAt, id, username, likes, comments },
}) {
  const handleComment = () => {
    console.log("the comment");
  };
  const handleLike = () => {
    console.log("the like");
  };
  const handleDelete = () => {};
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, username }} />
        <Button
          as={Link}
          to={`/posts/${id}`}
          labelPosition="right"
          onClick={handleComment}
        >
          <Button color="teal" basic>
            <Icon name="comments" />
          </Button>
          <Label as="a" basic color="teal" pointing="left">
            0
          </Label>
        </Button>
        {user && user.username === username && (
          <Button as="div" color="red" floated="right" onClick={handleDelete}>
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
