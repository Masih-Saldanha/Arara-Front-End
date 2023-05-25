import { createSlice } from "@reduxjs/toolkit";

interface Post {
    id: number;
    userId: number;
    users: { username: string };
    createdAt: string;
    comment: string;
};

interface PostListState {
    postList: Post[];
    page: number;
};

const initialState: PostListState = {
    postList: [],
    page: 0,
};

export const postListSlice = createSlice({
    name: "postList",
    initialState,
    reducers: {
        getFreshPosts: (state, action) => {
            state.postList = action.payload;
            state.page = 0;
        },
        getMorePosts: (state, action) => {
            const arrayPayload: Post[] = [...action.payload];
            const arrayLastTenPostList: Post[] = [...state.postList.slice(10)];
            for (let i = 0; i < arrayPayload.length; i++) {
                const elementArrayPayload = arrayPayload[i];
                for (const elementArrayLastTenPostList of arrayLastTenPostList) {
                    if (elementArrayPayload.id === elementArrayLastTenPostList.id) {
                        arrayPayload.splice(i, 1);
                    }
                }
            }
            state.postList = [...state.postList, ...arrayPayload];
            state.page += 1;
        },
    },
});

export const { getFreshPosts, getMorePosts } = postListSlice.actions;
export const postListReducer = postListSlice.reducer;