import { configureStore } from "@reduxjs/toolkit";

import { signUpReducer } from "./signUpSlice";
import { postReducer } from "./postSlice";
import { postListReducer } from "./postListSlice";

export const store = configureStore({
    reducer: {
        signUpReducer,
        postReducer,
        postListReducer,
    },
});

type GetStatTypeOfSignUp = typeof store.getState;

export type StoreState = ReturnType<GetStatTypeOfSignUp>;