import React from "react";
import UserCard from "../../user/UserCard/UserCard";
import getProfileImage from "../../../utils/getProfileImage";
import { useAuth } from "../../../hooks/useAuth";
import Styles from "./RightSidebar.module.css";

const RightSidebar = () => {
  const { user } = useAuth();
  const Users = [
    {
      id: 1,
      username: "irfan_sheikh",
      name: "MD IRFAN",
      image: getProfileImage(user),
    },
    {
      id: 2,
      username: "rehan_sheikh",
      name: "MD REHAN",
      image: getProfileImage(user),
    },
    {
      id: 3,
      username: "irfan_sheikh",
      name: "MD IRFAN",
      image: getProfileImage(user),
    },
    {
      id: 4,
      username: "rehan_sheikh",
      name: "MD REHAN",
      image: getProfileImage(user),
    },
    {
      id: 5,
      username: "irfan_sheikh",
      name: "MD IRFAN",
      image: getProfileImage(user),
    },
    {
      id: 6,
      username: "rehan_sheikh",
      name: "MD REHAN",
      image: getProfileImage(user),
    },
  ];

  // Getting Suggested users //todo
  return (
    <>
      <div className={Styles.container}>
        <h4>Suggested for you</h4>

        {Users.map((suggestedUser) => (
          <UserCard key={suggestedUser.id} userProfile={suggestedUser} />
        ))}
      </div>
    </>
  );
};

export default RightSidebar;
