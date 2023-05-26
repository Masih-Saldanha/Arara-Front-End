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
    page: 1,
};

export const postListSlice = createSlice({
    name: "postList",
    initialState,
    reducers: {
        getFreshPosts: (state, action) => {
            state.postList = action.payload;

            state.page = 1;
        },
        getMorePosts: (state, action) => {
            state.page += 1;
            const arrayPayload: Post[] = [...action.payload];
            const arrayLastTenPostList: Post[] = [...state.postList];

            const uniquePosts = arrayPayload.filter((post) => {
                return !arrayLastTenPostList.some((lastPost) => lastPost.id === post.id);
            });

            state.postList = [...state.postList, ...uniquePosts];
        },
    },
});

export const { getFreshPosts, getMorePosts } = postListSlice.actions;
export const postListReducer = postListSlice.reducer;