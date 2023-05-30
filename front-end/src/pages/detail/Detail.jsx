import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
// 아이콘
import { AiFillHeart } from "react-icons/ai";
import { FaWonSign, FaMapPin } from "react-icons/fa";
import { RxFileText } from "react-icons/rx";
import { FiClock } from "react-icons/fi";

// 라이브러리
import styled from "styled-components";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Editor, Viewer } from "@toast-ui/react-editor";
// 이미지
import RedShoesImg from "../../img/shoes.png";
// 컴포넌트
import Loading from "../Loading";
import ApplySection from "./ApplySection";
import CommentSection from "./comment/CommentSection";
import { editBoard, deleteBoard, setBoard } from "../../redux/features/boardSlice";
// 유틸리티
import elapsedText from "../../utils/elapsedText";

// 나중에 layouts로 이동 예정
const DetailTemplate = styled.div`
  width: 100vw;
  height: 100%;
  padding: 3rem 0;
  background-color: var(--bg-color);
`;

// 상세페이지 래퍼
const DetailWrapper = styled.div`
  max-width: 600px;
  display: block;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 0.5rem;
`;

// 본문 내용 섹션
const DetailContentsSection = styled.div`
  width: 90%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// 본문 헤더 박스
const ContentsSectionHeader = styled.div`
  border-bottom: 2px solid var(--bg-color);

  .header-title {
    display: flex;
    align-items: center;
    margin: 1rem 0;
    h2 {
      font-weight: 700;
      font-size: 1.5rem;
      flex: 1 0 0;
    }
  }

  .sub-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 3rem 1rem 1rem;
    .author-util {
      span {
        margin-right: 1rem;
      }
    }
    .interest {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
  }
`;

// 본문 바디 박스
const ContentsSectionBody = styled.div`
  /* height: 100%; */
  border-bottom: 2px solid var(--bg-color);
`;

// 태그와 수정삭제 컨트롤러 부분
const BodyUtils = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;

  .tags {
    display: flex;
    div {
      margin-right: 1rem;
      padding: 0.4rem 1rem;
      color: var(--primary-color);
      background-color: #ffd3d5;
      border-radius: 4rem;
    }
  }

  .utils {
    display: flex;

    button {
      flex: 2 0 0;
      font-size: 0.8rem;
      background-color: transparent; // 투명하게
      border: none;
      cursor: pointer;
      &:hover {
        color: var(--primary-color);
      }
    }
  }
`;

// 메인 내용 부분
const BodyMain = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  margin: 1rem 0 1rem;
  & > label {
    max-width: 8rem;
    padding: 0.4rem;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.4rem;
    font-size: 1.2rem;
    border-radius: 0.6rem;
    background-color: var(--bg-color);
  }

  & > p {
    margin: 1rem;
    font-size: 1.2rem;
  }

  input {
    padding: 0.4rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--bg-color);
  }
  .viewer {
    font-size: 1.4rem;
  }
`;

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.userInfo);
  const boards = useSelector(state => state.board);
  const board = boards.find(item => item.boardId === Number(id)) || {};

  const editorRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editText, setEditText] = useState({
    title: board.title,
    content: board.content,
    cost: board.cost,
    expiredDateTime: board.expiredDateTime,
    dongTag: board.dongTag,
    guTag: board.guTag,
    detailAddress: board.detailAddress,
  }); // 수정할 인풋값 상태
  const [openEditorInBoardId, setOpenEditorInBoardId] = useState(""); // 게시글 고유id값 담는 상태

  useEffect(() => {
    setIsLoading(true);
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/boards/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const freshBoard = response.data; // 받아온 단건 데이터 설정
        // 단건 데이터(객체)를 교체후 배열로 다시 저장
        const newBoards = boards.map(oldBoard => {
          if (oldBoard.boardId === id) {
            return freshBoard;
          }

          return oldBoard;
        });

        // setBoard로 갱신해줘야하는 데이터는 배열이여야함.
        dispatch(setBoard(newBoards));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError("게시글을 불러오지 못했습니다.");
      }
    };
    fetchBoard();
  }, []);

  // 게시글 수정
  const handleEdit = async (id, editText) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/boards/${id}`, editText, {
        headers: {
          Authorization: `${token}`,
        },
      });
      dispatch(editBoard(response.data));
    } catch (err) {
      alert("게시글을 수정하지 못했습니다.");
    }
  };

  // 게시글 삭제
  const handleDelete = async id => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/boards/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      dispatch(deleteBoard(response.data));
      navigate("/boards");
    } catch (err) {
      alert("게시글을 삭제하지 못했습니다.");
    }
  };

  // 수정할 인풋 이벤트
  const handleChange = event => {
    const { name, value } = event.target;
    setEditText(previous => ({ ...previous, [name]: value }));
  };

  // 에디터 변경 함수
  const handleEditorChange = () => {
    const editorInstance = editorRef.current.getInstance();
    setEditText(previous => ({ ...previous, content: editorInstance.getMarkdown() }));
  };

  // 이미지 업로드 비동기 요청 함수
  const uploadImages = async (blob, callback) => {
    const formData = new FormData();
    formData.append("file", blob);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/images`, formData);
      callback(response.data.image);
    } catch (error) {
      console.log(error);
    }
  };

  // 만료일자 날짜 정제 함수
  const formattedDate = new Date(board.expiredDateTime).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  // 게시글 배열
  const labels = [
    {
      id: "editor",
      title: "상세내용",
      icon: <RxFileText />,
      children: (
        <p>
          <Viewer className="viewer" initialValue={board.content} />
        </p>
      ),
      editChildren: (
        <Editor
          initialValue={board.content}
          previewStyle="vertical"
          height="350px"
          initialEditType="wysiwyg"
          useCommandShortcut={false}
          language="ko-KR"
          ref={editorRef}
          onChange={handleEditorChange}
          hooks={{
            addImageBlobHook: uploadImages,
          }}
        />
      ),
    },
    {
      id: "cost",
      title: "수고비(원)",
      icon: <FaWonSign />,
      children: <p>{board.cost}</p>,
      editChildren: (
        <input id="cost" type="number" name="cost" value={editText.cost} onChange={handleChange} required />
      ),
    },
    {
      id: "expiredDateTime",
      title: "만료일",
      icon: <FiClock />,
      children: <p>{formattedDate}</p>,
      editChildren: (
        <input
          id="expiredDate"
          type="datetime-local"
          name="expiredDateTime"
          value={editText.expiredDateTime}
          onChange={handleChange}
          required
        />
      ),
    },
    {
      id: "detail",
      title: "상세주소",
      icon: <FaMapPin />,
      children: <p>{board.detailAddress}</p>,
      editChildren: (
        <input id="detail" type="text" name="detailAddress" value={editText.detailAddress} onChange={handleChange} />
      ),
    },
  ];

  // 얼리리턴(예외처리)
  if (isLoading) return <Loading />;
  if (error) return <div>{error}</div>;
  if (!board?.boardId) return null;

  return (
    <DetailTemplate>
      <DetailWrapper>
        <DetailContentsSection>
          <ContentsSectionHeader>
            <div className="header-title">
              <div>
                <img src={RedShoesImg} alt="title-logo" style={{ width: "40px", height: "40px" }} />
              </div>
              <h2>{board.title}</h2>
            </div>
            <div className="sub-header">
              <div className="author-util">
                <span style={{ fontWeight: "700" }}>{board.member.nickName}</span>
                <span style={{ fontSize: "0.8rem" }}>{elapsedText(new Date(board.createdDate))}</span>
              </div>
              <div className="interest">
                <AiFillHeart style={{ width: "20px", height: "20px", color: "var(--primary-color)" }} />
                <div>0</div>
              </div>
            </div>
          </ContentsSectionHeader>
          <ContentsSectionBody>
            <BodyUtils>
              <div className="tags">
                <div>{board.guTag}</div>
                <div>{board.dongTag}</div>
              </div>
              {currentUser !== null && currentUser.memberId === board.member.memberId && (
                <div className="utils">
                  <button
                    type="button"
                    onClick={() => {
                      if (id === openEditorInBoardId) {
                        handleEdit(id, editText);
                        setOpenEditorInBoardId("");
                      } else {
                        setOpenEditorInBoardId(id);
                      }
                    }}
                  >
                    수정
                  </button>
                  <button type="button" onClick={() => handleDelete(id)}>
                    삭제
                  </button>
                </div>
              )}
            </BodyUtils>
            {labels.map(label => {
              return (
                <BodyMain>
                  <label htmlFor={label.id}>
                    {label.icon}
                    {label.title}
                  </label>
                  {openEditorInBoardId === id ? <p>{label.editChildren}</p> : <p>{label.children}</p>}
                </BodyMain>
              );
            })}
          </ContentsSectionBody>
        </DetailContentsSection>
        <ApplySection setIsLoading={setIsLoading} />
        <CommentSection setIsLoading={setIsLoading} />
      </DetailWrapper>
    </DetailTemplate>
  );
}

export default Detail;

// const { boardId, title, memberId, createdDate, content, cost, expiredDate, dongTag, guTag, detailAddress } =
//   board || null; // 게시글 구조분해할당

// 해당 게시글 수정
// const updateBoard = (boardId, body) => {
//   axios.patch(`http://localhost:8080/boards/${boardId}`, { ...board, body });
// };
