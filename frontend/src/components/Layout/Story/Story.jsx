import React from "react";
import Styles from "./Story.module.css";
import StoryItem from "./StoryItem";
import getProfileImage from "../../../utils/getProfileImage";
import { useAuth } from "../../../hooks/useAuth";

const Story = () => {
  const { user } = useAuth();

  const stories = [
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
    { id: 1, username: "irfan", image: getProfileImage(user) },
    { id: 2, username: "rahul", image: getProfileImage(user) },
  ];

  return (
    <div className={Styles.container}>
      <div className={Styles.stories}>
        {/* Own Story */}
        <StoryItem image={getProfileImage(user)} isOwn={true} />

        {/* Other Stories */}
        {stories.map((story) => (
          <StoryItem
            key={story.id}
            image={story.image}
            username={story.username}
          />
        ))}
      </div>
    </div>
  );
};

export default Story;
