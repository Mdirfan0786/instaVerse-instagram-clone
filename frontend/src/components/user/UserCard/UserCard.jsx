import React from "react";
import Styles from "./UserCard.module.css";
import getProfileImage from "../../../utils/getProfileImage";
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";

const UserCard = ({ userProfile }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={Styles.userCard_Container}>
        <div className={Styles.userCard}>
          <img
            onClick={() => navigate(`/profile/${userProfile.username}`)}
            src={userProfile.image}
            alt="Profile_Pic"
          />
          <div className={Styles.user_details}>
            <p onClick={() => navigate(`/profile/${userProfile.username}`)}>
              {userProfile?.username}
            </p>
            <span>{userProfile?.name}</span>
          </div>
        </div>

        <Button
          variant="contained"
          color="primary"
          fullWidth={false}
          sx={{ px: 2, py: 0.5, fontSize: "12px" }}
        >
          Follow
        </Button>
      </div>
    </>
  );
};

export default UserCard;
