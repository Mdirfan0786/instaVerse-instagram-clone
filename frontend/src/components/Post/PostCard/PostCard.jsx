import React, { useEffect, useRef } from "react";
import Styles from "./PostCard.module.css";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";

const PostCard = ({ post, currentUser }) => {
  const videoRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.6 },
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={Styles.PostCard}>
      <PostHeader user={post.owner} />

      <div className={Styles.postMediaContainer}>
        {post.type === "image" && (
          <img src={post.media} alt="Post_image" className={Styles.postMedia} />
        )}

        {(post.type === "video" || post.type === "reel") && (
          <video
            ref={videoRef}
            src={post.media}
            className={`${Styles.postMedia} ${
              post.type === "video" || post.type === "reel"
                ? Styles.contain
                : Styles.cover
            }`}
            muted
            loop
            playsInline
            autoPlay={post.type === "reel"}
            onClick={(e) => {
              if (e.target.paused) {
                e.target.play();
              } else {
                e.target.pause();
              }
            }}
          />
        )}
      </div>

      <div className={Styles.postContent}>
        <PostActions post={post} currentUser={currentUser} />
        <PostCaption post={post} />
      </div>
    </div>
  );
};

export default PostCard;
