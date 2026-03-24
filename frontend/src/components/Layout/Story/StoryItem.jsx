import React from "react";
import Styles from "./Story.module.css";

const StoryItem = ({ image, username, isOwn }) => {
  return (
    <div className={Styles.story_item}>
      <div className={isOwn ? Styles.own_ring : Styles.story_ring}>
        <img src={image} alt="story" />
      </div>
      <p>{isOwn ? "Your Story" : username}</p>
    </div>
  );
};

export default StoryItem;
