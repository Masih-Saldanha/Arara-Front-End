import { createSlice } from "@reduxjs/toolkit";

interface SignUpState {
    localStorageToken: string;
    signUpUsername: string,
    signUpPassword: string,
    loading: boolean,
};

const initialState: SignUpState = {
    localStorageToken: localStorage.getItem("certiToken"),
    signUpUsername: "",
    signUpPassword: "",
    loading: true,
};

export const signUpSlice = createSlice({
    name: "signup",
    initialState,
    reducers: {
        editSignUpUsername: (state, action) => {
            state.signUpUsername = action.payload;
            if (state.signUpUsername === "" || state.signUpPassword ==="") {
                state.loading = true;
            } else {
                state.loading = false;
            }
        },
        editSignUpPassword: (state, action) => {
            state.signUpPassword = action.payload;
            if (state.signUpUsername === "" || state.signUpPassword ==="") {
                state.loading = true;
            } else {
                state.loading = false;
            }
        },
        storeToken: (state, action) => {
            editSignUpUsername(action.payload);
            state.localStorageToken = action.payload;
            localStorage.setItem("certiToken", action.payload);
        },
        unstoreToken: (state) => {
            state.localStorageToken = null;
            localStorage.clear();
        },
    },
});

export const { editSignUpUsername, editSignUpPassword, storeToken, unstoreToken } = signUpSlice.actions;
export const signUpReducer = signUpSlice.reducer;