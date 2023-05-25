import { configureStore } from "@reduxjs/toolkit";

import { signUpReducer } from "./signUpSlice";
import { signInReducer } from "./signInSlice";
import { postReducer } from "./postSlice";
import { postListReducer } from "./postListSlice";

export const store = configureStore({
    reducer: {
        signUpReducer,
        signInReducer,
        postReducer,
        postListReducer,
    },
});

type GetStatTypeOfSignUp = typeof store.getState;

export type StoreState = ReturnType<GetStatTypeOfSignUp>;