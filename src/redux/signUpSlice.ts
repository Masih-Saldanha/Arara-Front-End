import { createSlice } from "@reduxjs/toolkit";

interface SignUpState {
    signUpUsername: string,
    signUpPassword: string,
    loading: boolean,
};

const initialState: SignUpState = {
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
    },
});

export const { editSignUpUsername, editSignUpPassword } = signUpSlice.actions;
export const signUpReducer = signUpSlice.reducer;