import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../redux/hook";
import { editSignUpPassword, editSignUpUsername } from "../redux/signUpSlice";
import networkRequests from "../actions/networkRequests";

function SignUpSquare() {
    const navigate = useNavigate();

    const signUpUsername = useAppSelector((state) => state.signUpReducer.signUpUsername);
    const signUpPassword = useAppSelector((state) => state.signUpReducer.signUpPassword);
    const loading = useAppSelector((state) => state.signUpReducer.loading);
    const localStorageToken = useAppSelector((state) => state.signInReducer.localStorageToken);

    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorageToken !== null) {
            navigate("/main");
            return;
        }
    }, [])

    function handleSignUpUsername(e: { target: { value: any; }; }) {
        dispatch(editSignUpUsername(e.target.value));
    };

    function handleSignUpPassword(e: { target: { value: any; }; }) {
        dispatch(editSignUpPassword(e.target.value));
    };

    function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        networkRequests
            .signUp(signUpUsername, signUpPassword)
            .then((response) => {
                console.log(response.data);
                alert(response.data);
                navigate("/signin");
            })
            .catch((e) => {
                console.log(e.response.data);
                alert(e.response.data);
            })
    };

    return (
        <main className="bg-white border rounded p-4" style={{ minWidth: '300px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <form onSubmit={handleSubmit}>
                <h2 className="mb-4 text-center">Welcome! Create your account on Cerdi Amazônia Chat!</h2>
                <h3 className="mb-3">Username:</h3>
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Username"
                    value={signUpUsername}
                    onChange={handleSignUpUsername}
                ></input>
                <h3 className="mb-3">Password:</h3>
                <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={handleSignUpPassword}
                ></input>
                <div className="d-flex justify-content-center mt-2">
                    <button
                        id="home-tab2"
                        className="btn btn-lg btn-primary"
                        data-bs-toggle="tab"
                        role="tab"
                        aria-selected="true"
                        type="submit"
                        disabled={loading}
                    >Sign Up</button>
                </div>
            </form>
            <h4 onClick={() => navigate("/signin")} className="text-center mt-3">Already registered? Sign In here!</h4>
        </main>
    )
};

export default SignUpSquare;