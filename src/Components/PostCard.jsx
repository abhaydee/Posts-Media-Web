import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon, Image, Label } from "semantic-ui-react";
import { AuthContext } from "../utils/context";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";
import Avatar from "../images/avatar.jpg";
import MyPopup from "./MyPopup";
function PostCard({
  post: { body, createdAt, id, username, likes, comments },
}) {
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content>
        <Image floated="right" size="small" src={Avatar} />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, username }} />
        <MyPopup content="Comment on Post..">
          <Button as={Link} to={`/posts/${id}`} labelPosition="right">
            <Button color="teal" basic>
              <Icon name="comments" />
            </Button>
            <Label as="a" basic color="teal" pointing="left">
              0
            </Label>
          </Button>
        </MyPopup>

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
