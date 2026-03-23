import defaultProfile from "../assets/images/default.jpg";

const getProfileImage = (user) => {
  return user?.profilePic?.url || defaultProfile;
};

export default getProfileImage;
