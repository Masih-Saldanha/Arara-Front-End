import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
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
    
    const decodedToken = networkRequests.returnDecodedToken(localStorageToken);

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
                loader={<Loading message="Loading more posts..."></Loading>}
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
        <MainDiv>
            <section>
                <header>
                    <h1>CodeLeap Network</h1>
                    <BiLogOut size={30} onClick={toggleModalLogOut} />
                    <Modal
                        isOpen={isOpenLogOut}
                        onRequestClose={toggleModalLogOut}
                        className="_"
                        overlayClassName="_"
                        contentElement={(props, children) => (
                            <LogOutModalStyle {...props}>{children}</LogOutModalStyle>
                        )}
                        overlayElement={(props, contentElement) => (
                            <LogOutOverlayStyle {...props}>{contentElement}</LogOutOverlayStyle>
                        )}
                    >
                        <>
                            <h2>Are you sure you want to logout?</h2>
                            <aside>
                                <aside>
                                    <CancelLogOut onClick={toggleModalLogOut}>Cancel</CancelLogOut>
                                    <ConfirmLogOut onClick={logOut}>Logout</ConfirmLogOut>
                                </aside>
                            </aside>
                        </>
                    </Modal>
                </header>
                <PostSquare></PostSquare>
                {showPosts()}
            </section>
        </MainDiv>
    )
};

const MainDiv = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    section {
        background-color: #FFFFFF;
        max-width: 800px;
        width: 100%;
        header {
            display: flex;
            justify-content: space-between;
            background-color: #7695EC;
            padding: 27px 37px;
            align-items: center;
            svg {
                color: white;
                border-radius: 8px;
                :hover {
                    color: red;
                }
            }
        }
    }
`

const LogOutModalStyle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #FFFFFF;
    border-radius: 16px;
    border: 1px solid #999999;
    width: 660px;
    height: auto;
    padding: 24px;
    h3 {
        padding: 24px 0 8px 0;
    }
    input {
        border: 1px solid #777777;
        font-size: 14px;
    }
    input::placeholder {
        font-size: 14px;
        color: #CCCCCC;
    }
    textarea {
        resize: none;
        width: 100%;
        height: 74px;
        border-radius: 8px;
        border: 1px solid #777777;
        padding: 8px;
        font-size: 14px;
    }
    textarea::placeholder {
        font-size: 14px;
        color: #CCCCCC;
    }
    aside{
        width: 100%;
        display: flex;
        justify-content: end;
        padding-top: 12px;
        aside {
            width: 256px;
            display: flex;
            justify-content: space-between;
        }
    }
`

const LogOutOverlayStyle = styled.div`
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3500;
    background: rgba(119, 119, 119, 0.8);
`

const CancelLogOut = styled.button`
    background-color: #FFFFFF;
    border: 1px solid #999999;
    :hover {
        background-color: red;
        color: white;
    }
`

const ConfirmLogOut = styled.button`
    background-color: #FF5151;
    color: #FFFFFF;
    :hover {
        background-color: red;
        color: white;
    }
`

export default Main;