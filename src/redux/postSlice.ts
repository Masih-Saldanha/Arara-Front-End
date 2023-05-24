import { createSlice } from "@reduxjs/toolkit";

interface PostState {
    titleText: string;
    contentText: string;
    postButtonDisabled: boolean;
    postButtonColor: string;
};

const initialState: PostState = {
    titleText: "",
    contentText: "",
    postButtonDisabled: true,
    postButtonColor: "grey",
};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        editTitle: (state, action) => {
            state.titleText = action.payload;
            if (state.titleText === "" || state.contentText === "") {
                state.postButtonColor = "grey";
                state.postButtonDisabled = true;
            } else {
                state.postButtonColor = "#7695EC";
                state.postButtonDisabled = false;
            };
        },
        editContent: (state, action) => {
            state.contentText = action.payload;
            if (state.titleText === "" || state.contentText === "") {
                state.postButtonColor = "grey";
                state.postButtonDisabled = true;
            } else {
                state.postButtonColor = "#7695EC";
                state.postButtonDisabled = false;
            };
        },
    },
});

export const { editTitle, editContent } = postSlice.actions;
export const postReducer = postSlice.reducer;