import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon, Image, Label } from "semantic-ui-react";
function PostCard({
  post: { body, createdAt, id, username, likes, comments },
}) {
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
        <Button as="div" labelPosition="right">
          <Button color="teal" basic>
            <Icon name="heart" />
            Like
          </Button>
          <Label as="a" basic color="teal" pointing="left">
            2,048
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PostCard;
