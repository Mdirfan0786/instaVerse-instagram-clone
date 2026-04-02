import React, { useEffect, useState } from "react";
import Story from "../../components/Layout/Story/Story";
import PostCard from "../../components/Post/PostCard/PostCard";
import { clientServer } from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Fetching feed posts
  const fetchFeedPosts = async () => {
    try {
      const res = await clientServer.get("/posts/feed");

      setPosts(res.data.posts || []);
    } catch (err) {
      console.log("Error while fetching feedPost: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Stories */}
      <Story />

      {/* Loader */}
      {loading && <p>Loading posts...</p>}

      {/* Posts Feed */}
      <div style={{ marginTop: "20px" }}>
        {!loading && posts.length === 0 && <p>No posts available</p>}

        {posts.map((post) => (
          <PostCard key={post._id} post={post} currentUser={user} />
        ))}
      </div>
    </div>
  );
};

export default Home;
