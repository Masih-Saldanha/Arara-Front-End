import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import styled from "styled-components";

import { useAppSelector } from "../redux/hook";
import networkRequests from "../actions/networkRequests";
import { getFreshPosts } from "../redux/postListSlice";
import Loading from "./Loading";
import trash from "../assets/trash.svg";
import edit from "../assets/edit.svg";

function PostModel(props: { id: number; userId: number; users: {username: string}; createdAt: any; comment: string; }) {
    const { id, userId, users, createdAt, comment } = props;

    const localStorageToken = useAppSelector((state) => state.signInReducer.localStorageToken);
    const decodedToken = networkRequests.returnDecodedToken(localStorageToken);

    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        comment: "",
    });

    const dispatch = useDispatch();

    Modal.setAppElement("#root");

    const now = dayjs(Date());
    const date = dayjs(createdAt);

    const minutes = now.diff(date, "minute");
    const hours = now.diff(date, "hour");
    const days = now.diff(date, "day");
    const months = now.diff(date, "month");
    const years = now.diff(date, "year");

    let minuteString: string;
    let hourString: string;
    let dayString: string;
    let monthString: string;
    let yearString: string;

    minutes !== 1 ? (minuteString = "minutes") : (minuteString = "minute");
    hours !== 1 ? (hourString = "hours") : (hourString = "hour");
    days !== 1 ? (dayString = "days") : (dayString = "day");
    months !== 1 ? (monthString = "months") : (monthString = "month");
    years !== 1 ? (yearString = "years") : (yearString = "year");

    let dateString = `${minutes} ${minuteString} ago`
    hours === 0 ? (dateString = dateString) : (dateString = `${hours} ${hourString} ago`);
    days === 0 ? (dateString = dateString) : (dateString = `${days} ${dayString} ago`);
    months === 0 ? (dateString = dateString) : (dateString = `${months} ${monthString} ago`);
    years === 0 ? (dateString = dateString) : (dateString = `${years} ${yearString} ago`);

    function toggleModalDelete() {
        setIsOpenDelete(!isOpenDelete);
    };

    function deletePost() {
        setDeleting(true);
        networkRequests
            .deletePost(id, localStorageToken)
            .then((response) => {
                networkRequests
                    .getPosts(0, localStorageToken)
                    .then((response) => {
                        setDeleting(false);
                        dispatch(getFreshPosts(response.data));
                    })
                    .catch((e) => {
                        setDeleting(false);
                        alert("could not retrieve new comments");
                    });
            })
            .catch((e) => {
                setDeleting(false);
                alert("could not delete your comment");
            });
    }

    function toggleModalEdit() {
        setIsOpenEdit(!isOpenEdit);
    };

    function handleEditInputs(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, property: string) {
        setEditData({ ...editData, [property]: e.target.value });
    };

    function editPost() {
        setEditing(true);
        networkRequests
            .editPost(editData.comment, userId, id, localStorageToken)
            .then((response) => {
                networkRequests
                    .getPosts(0, localStorageToken)
                    .then((response) => {
                        setEditing(false);
                        dispatch(getFreshPosts(response.data));
                        toggleModalEdit();
                        setEditData({ comment: "" });
                    })
                    .catch((e) => {
                        setEditing(false);
                        alert("could not retrieve new posts");
                    });
            })
            .catch((e) => {
                setEditing(false);
                alert("could not edit your post");
            });
    };

    return (
        <PostDiv>
            <TopBar>
                {
                    decodedToken.username === users.username ?
                        <div>
                            <DeleteButton src={trash} onClick={toggleModalDelete}></DeleteButton>
                            <Modal
                                isOpen={isOpenDelete}
                                onRequestClose={toggleModalDelete}
                                className="_"
                                overlayClassName="_"
                                contentElement={(props, children) => (
                                    <DeleteModalStyle {...props}>{children}</DeleteModalStyle>
                                )}
                                overlayElement={(props, contentElement) => (
                                    <DeleteOverlayStyle {...props}>{contentElement}</DeleteOverlayStyle>
                                )}
                            >
                                {
                                    !deleting ?
                                        <>
                                            <h2>Are you sure you want to delete this comment?</h2>
                                            <aside>
                                                <aside>
                                                    <CancelDelete onClick={toggleModalDelete}>Cancel</CancelDelete>
                                                    <ConfirmDelete onClick={deletePost}>Delete</ConfirmDelete>
                                                </aside>
                                            </aside>
                                        </>
                                        :
                                        <Loading message="Deleting"></Loading>
                                }
                            </Modal>

                            <EditButton src={edit} onClick={toggleModalEdit}></EditButton>
                            <Modal
                                isOpen={isOpenEdit}
                                onRequestClose={toggleModalEdit}
                                className="_"
                                overlayClassName="_"
                                contentElement={(props, children) => (
                                    <DeleteModalStyle {...props}>{children}</DeleteModalStyle>
                                )}
                                overlayElement={(props, contentElement) => (
                                    <DeleteOverlayStyle {...props}>{contentElement}</DeleteOverlayStyle>
                                )}
                            >
                                {
                                    !editing ?
                                        <>
                                            <h2>Edit comment</h2>
                                            <textarea
                                                placeholder="Comment here"
                                                value={editData.comment}
                                                onChange={(e) => handleEditInputs(e, "comment")}
                                            ></textarea>
                                            <aside>
                                                <aside>
                                                    <CancelDelete onClick={toggleModalEdit}>Cancel</CancelDelete>
                                                    <ConfirmEdit onClick={editPost}>Save</ConfirmEdit>
                                                </aside>
                                            </aside>
                                        </>
                                        :
                                        <Loading message="Editing"></Loading>
                                }
                            </Modal>
                        </div>
                        :
                        <></>
                }
            </TopBar>
            <UserDataBar>
                <h5>{users.username}</h5>
                <h5>{dateString}</h5>
            </UserDataBar>
            <p>{comment}</p>
        </PostDiv>
    )
};

const PostDiv = styled.div`
    border: 1px solid #999999;
    border-radius: 16px;
    margin: 0 24px 24px 24px;
    p {
        padding: 0 24px 24px 24px;
    }
`

const TopBar = styled.div`
    background-color: #7695EC;
    border-radius: 16px 16px 0px 0px;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
        width: 86px;
        display: flex;
        justify-content: space-between;
        img {
            width: 30px;
            height: 30px;
            border-radius: 8px;
        }
    }
`

const DeleteButton = styled.img`
    :hover {
        background-color: red;
    }
`

const EditButton = styled.img`
    :hover {
        background-color: green;
    }
`

const UserDataBar = styled.div`
    padding: 24px 24px 16px 24px;
    color: #777777;
    display: flex;
    justify-content: space-between;
`

const DeleteModalStyle = styled.div`
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

const DeleteOverlayStyle = styled.div`
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

const CancelDelete = styled.button`
    background-color: #FFFFFF;
    border: 1px solid #999999;
    :hover {
        background-color: red;
        color: white;
    }
`

const ConfirmDelete = styled.button`
    background-color: #FF5151;
    color: #FFFFFF;
    :hover {
        background-color: red;
        color: white;
    }
`

const ConfirmEdit = styled.button`
    background-color: #47B960;
    color: #FFFFFF;
    :hover {
        background-color: green;
        color: white;
    }
`

export default PostModel;