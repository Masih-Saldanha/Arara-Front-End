import { createSlice } from "@reduxjs/toolkit";

interface SignInState {
    localStorageToken: string;
    signInUsername: string,
    signInPassword: string,
    loading: boolean,
};

const initialState: SignInState = {
    localStorageToken: localStorage.getItem("certiToken"),
    signInUsername: "",
    signInPassword: "",
    loading: true,
};

export const signInSlice = createSlice({
    name: "signin",
    initialState,
    reducers: {
        editSignInUsername: (state, action) => {
            state.signInUsername = action.payload;
            if (state.signInUsername === "" || state.signInPassword ==="") {
                state.loading = true;
            } else {
                state.loading = false;
            }
        },
        editSignInPassword: (state, action) => {
            state.signInPassword = action.payload;
            if (state.signInUsername === "" || state.signInPassword ==="") {
                state.loading = true;
            } else {
                state.loading = false;
            }
        },
        storeToken: (state, action) => {
            editSignInUsername(action.payload);
            state.localStorageToken = action.payload;
            localStorage.setItem("certiToken", action.payload);
        },
        unstoreToken: (state) => {
            state.localStorageToken = null;
            localStorage.clear();
        },
    },
});

export const { editSignInUsername, editSignInPassword, storeToken, unstoreToken } = signInSlice.actions;
export const signInReducer = signInSlice.reducer;