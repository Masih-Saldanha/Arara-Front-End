import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../redux/hook";
import { editSignInPassword, editSignInUsername, storeToken } from "../redux/signInSlice";
import networkRequests from "../actions/networkRequests";

function SignInSquare() {
    const navigate = useNavigate();

    const signInUsername = useAppSelector((state) => state.signInReducer.signInUsername);
    const signInPassword = useAppSelector((state) => state.signInReducer.signInPassword);
    const loading = useAppSelector((state) => state.signInReducer.loading);
    const localStorageToken = useAppSelector((state) => state.signInReducer.localStorageToken);

    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorageToken !== null) {
            navigate("/main");
            return;
        }
    }, [])

    function handleSignInUsername(e: { target: { value: any; }; }) {
        dispatch(editSignInUsername(e.target.value));
    };

    function handleSignInPassword(e: { target: { value: any; }; }) {
        dispatch(editSignInPassword(e.target.value));
    };

    function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        networkRequests
            .signIn(signInUsername, signInPassword)
            .then((response) => {
                dispatch(storeToken(response.data));
                console.log(response.data);
                alert(response.data);
                navigate("/main");
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
                    value={signInUsername}
                    onChange={handleSignInUsername}
                ></input>
                <h3 className="mb-3">Password:</h3>
                <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Password"
                    value={signInPassword}
                    onChange={handleSignInPassword}
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
                    >Sign In</button>
                </div>
            </form>
            <h4 onClick={() => navigate("/signup")} className="text-center mt-3">Don't have an account yet? Sign Up here!</h4>
        </main>
    )
};

export default SignInSquare;