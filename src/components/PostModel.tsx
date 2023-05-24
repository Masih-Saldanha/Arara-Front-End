import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import styled from "styled-components";

import { useAppSelector } from "../redux/hook";
import networkRequests from "../actions/networkRequests";
import { getFreshPosts } from "../redux/postListSlice";
import trash from "../assets/trash.svg";
import edit from "../assets/edit.svg";
import Loading from "./Loading";

function PostModel(props: { postId: number; title: any; username: any; created_datetime: any; content: any; }) {
    const { postId, title, username, created_datetime, content } = props;

    const signUpText = useAppSelector((state) => state.signUpReducer.signUpText);

    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        content: "",
    });

    const dispatch = useDispatch();

    Modal.setAppElement("#root");

    const now = dayjs(Date());
    const date = dayjs(created_datetime);

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
            .deletePost(postId)
            .then((response) => {
                networkRequests
                    .getPosts(0)
                    .then((response) => {
                        setDeleting(false);
                        dispatch(getFreshPosts(response.data.results));
                    })
                    .catch((e) => {
                        setDeleting(false);
                        alert("could not retrieve new posts");
                    });
            })
            .catch((e) => {
                setDeleting(false);
                alert("could not delete your post");
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
            .editPost(postId, editData.title, editData.content)
            .then((response) => {
                networkRequests
                    .getPosts(0)
                    .then((response) => {
                        setEditing(false);
                        dispatch(getFreshPosts(response.data.results));
                        toggleModalEdit();
                        setEditData({ title: "", content: "" });
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
                <h1>{title}</h1>
                {
                    signUpText === username ?
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
                                            <h2>Are you sure you want to delete this item?</h2>
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
                                            <h2>Edit item</h2>
                                            <h3>Title</h3>
                                            <input
                                                type="text"
                                                placeholder="Hello world"
                                                value={editData.title}
                                                onChange={(e) => handleEditInputs(e, "title")}
                                            ></input>
                                            <h3>Content</h3>
                                            <textarea
                                                placeholder="Content here"
                                                value={editData.content}
                                                onChange={(e) => handleEditInputs(e, "content")}
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
                <h5>{username}</h5>
                <h5>{dateString}</h5>
            </UserDataBar>
            <p>{content}</p>
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