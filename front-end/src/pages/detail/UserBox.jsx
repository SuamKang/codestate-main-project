import React from "react";
import styled from "styled-components";
import { FaUserAlt } from "react-icons/fa";
import elapsedText from "../../utils/elapsedText";

import blankProfileImage from "../../img/blank-profile.png";

const UserInfoWrapper = styled.div`
  width: 9rem;
  padding: 0.5rem 0.3rem 0.5rem;
  display: flex;
  gap: 0.8rem;

  .avatar {
    width: 2.4rem;
    height: 2.4rem;
    border: none;
    border-radius: 50%;
    background-color: grey;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    & > img {
      display: block;
      width: 100%;
      height: auto;
      overflow: hidden;
      object-fit: cover;
    }
  }
  .info {
    .author {
      margin: 0.2rem 0 0.4rem;
    }
    .createdAt {
      font-size: 0.6rem;
      color: var(--font-color-light);
    }
  }
`;

// 유저 정보 컴포넌트
function UserBox({ infoData }) {
  return (
    <UserInfoWrapper>
      <div className="avatar">
        {/* <FaUserAlt size="70%" /> */}
        {infoData.images ? (
          <img src={infoData.images} alt="user profile" />
        ) : (
          <img src={blankProfileImage} alt="blanked user profile" />
        )}
      </div>
      <div className="info">
        <div className="author">{infoData.member.nickName}</div>
        <div className="createdAt">{elapsedText(new Date(infoData.createdDate))}</div>
      </div>
    </UserInfoWrapper>
  );
}

export default UserBox;
