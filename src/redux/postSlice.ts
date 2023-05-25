import { createSlice } from "@reduxjs/toolkit";

interface PostState {
    commentText: string;
    postButtonDisabled: boolean;
};

const initialState: PostState = {
    commentText: "",
    postButtonDisabled: true,
};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        editComment: (state, action) => {
            state.commentText = action.payload;
            if (state.commentText === "") {
                state.postButtonDisabled = true;
            } else {
                state.postButtonDisabled = false;
            };
        },
    },
});

export const { editComment } = postSlice.actions;
export const postReducer = postSlice.reducer;