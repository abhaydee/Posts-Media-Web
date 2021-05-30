import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon, Image, Label, Popup } from "semantic-ui-react";
import { AuthContext } from "../utils/context";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";
import Avatar from "../images/avatar.jpg";
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
        <Image floated="right" size="small" src={Avatar} />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, username }} />
        <Popup
          content="Comment on Post.."
          trigger={
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
          }
        />

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
