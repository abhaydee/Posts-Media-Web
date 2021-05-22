import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Grid, Image } from "semantic-ui-react";
import PostCard from "./PostCard";
function Home() {
  const { loading, data } = useQuery(FETCH_POSTS);
  if (data) {
    console.log("returning the data", data);
  }
  const postData = data && data?.getPosts;
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading Posts..</h1>
        ) : (
          postData &&
          postData.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}
const FETCH_POSTS = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likes {
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
export default Home;
