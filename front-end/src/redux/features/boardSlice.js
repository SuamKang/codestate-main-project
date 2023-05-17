import { createSlice } from "@reduxjs/toolkit";

// const initialState = [
//   {
//     id: 1,
//     memberId: 1,
//     title: "우리 집 강아지 산책 시켜주세요",
//     content: "제가 3일정도 출장을 가게 되서 강아지 산책시킬 시간이 없네요. 혹시 가능하신분 계실까요?",
//     cost: "50,000",
//     viewCount: 10,
//     createdDate: "2023-05-05",
//     expiredDate: "2001-11-30",
//     dongTag: "제기동",
//     guTag: "동대문구",
//     detailAddress: "301호",
//     completed: false,
//   },
//   {
//     id: 2,
//     memberId: 2,
//     title: "바퀴벌레 좀 잡아주세요",
//     content: "엄청 큰 바퀴벌레가 화장실에서 기어다니는데 도저히 못잡겠어요ㅠㅠ",
//     cost: "10,000",
//     viewCount: 10,
//     createdDate: "2023-05-05",
//     expiredDate: "2001-11-30",
//     dongTag: "상도동",
//     guTag: "동작구",
//     detailAddress: "230-1",
//     completed: false,
//   },
// ];

const boardSlice = createSlice({
  name: "board",
  initialState: [],
  reducers: {
    editBoard(state, action) {
      const ind = state.findIndex(a => a.id === action.payload.id);

      return [...state.slice(0, ind), action.payload, ...state.slice(ind + 1)];
    },
    deleteBoard(state, action) {
      return state.filter(a => a.id !== action.payload.id);
    },
    setBoard(_, action) {
      return action.payload;
    },
  },
});

export const { editBoard, deleteBoard, setBoard } = boardSlice.actions;
export default boardSlice.reducer;
