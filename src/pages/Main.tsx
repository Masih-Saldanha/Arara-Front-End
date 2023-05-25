import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { BiLogOut } from "react-icons/bi";

import { useAppSelector } from "../redux/hook";
import { getFreshPosts, getMorePosts } from "../redux/postListSlice";
import networkRequests from "../actions/networkRequests";
import PostSquare from "../components/PostSquare";
import PostModel from "../components/PostModel";
import Loading from "../components/Loading";
import { unstoreToken } from "../redux/signInSlice";

function Main() {
    const navigate = useNavigate();

    const postList = useAppSelector((state) => state.postListReducer.postList);
    const page = useAppSelector((state) => state.postListReducer.page);
    const localStorageToken = useAppSelector((state) => state.signInReducer.localStorageToken);

    const [isOpenLogOut, setIsOpenLogOut] = useState(false);

    const dispatch = useDispatch();

    Modal.setAppElement("#root");

    useEffect(() => {
        if (localStorageToken === null) {
            navigate("/signin");
            return;
        };
        networkRequests
            .getPosts(0, localStorageToken)
            .then((response) => {
                dispatch(getFreshPosts(response.data));
            })
            .catch((e) => {
                alert("could not retrieve new posts");
            })
    }, []);

    function fetchMoreData() {
        networkRequests
            .getPosts(page, localStorageToken)
            .then((response) => {
                dispatch(getMorePosts(response.data.results));
            })
            .catch((e) => {
                alert("could not retrieve new posts");
            })
    };

    function toggleModalLogOut() {
        setIsOpenLogOut(!isOpenLogOut);
    };

    function logOut() {
        dispatch(unstoreToken());
        navigate("/signin");
    };

    function showPosts() {
        return (
            <InfiniteScroll
                dataLength={postList.length}
                next={fetchMoreData}
                hasMore={true}
                loader={<Loading message="Loading more comments..."></Loading>}
            >
                {postList.map((post) => {
                    const { id, userId, users, createdAt, comment } = post;
                    return (
                        <PostModel
                            key={id}
                            id={id}
                            userId={userId}
                            users={users}
                            createdAt={createdAt}
                            comment={comment}
                        ></PostModel>
                    )
                })}
            </InfiniteScroll>
        )
    }

    return (
        <main className="d-flex flex-column justify-content-center">
            <section className="bg-white max-width-800 width-100">
                <header className="d-flex justify-content-between bg-primary px-4 py-3 align-items-center">
                    <h1>Certi Amazônia Chat</h1>
                    <BiLogOut size={30} onClick={toggleModalLogOut} className="text-white rounded-circle cursor-pointer" />
                    <Modal
                        isOpen={isOpenLogOut}
                        onRequestClose={toggleModalLogOut}
                        className="modal-dialog"
                        overlayClassName="position-fixed d-flex justify-content-center align-items-center top-0 left-0 right-0 bottom-0 w-100"
                        style={{ overlay: { zIndex: 3500, backgroundColor: "rgba(119, 119, 119, 0.8)" } }}
                    >
                        <div className="modal-content bg-white border rounded p-2">
                            <div className="modal-body p-2">
                                <h2 className="modal-title">Are you sure you want to logout?</h2>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary m-2" onClick={toggleModalLogOut}>Cancel</button>
                                <button type="button" className="btn btn-primary m-2" onClick={logOut}>Logout</button>
                            </div>
                        </div>
                    </Modal>
                </header>
                <PostSquare></PostSquare>
                {showPosts()}
            </section>
        </main>
    )
};

export default Main;