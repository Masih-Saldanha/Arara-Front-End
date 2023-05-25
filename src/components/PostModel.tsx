import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { BiTrash } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";

import { useAppSelector } from "../redux/hook";
import networkRequests from "../actions/networkRequests";
import { getFreshPosts } from "../redux/postListSlice";
import Loading from "./Loading";

function PostModel(props: { id: number; userId: number; users: { username: string }; createdAt: any; comment: string; }) {
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
        <div className="border-1px-solid-999999 border rounded mb-3 mx-3">
            <div className="bg-primary rounded-top p-3 d-flex justify-content-between align-items-center">
                <div className="text-color-white d-flex justify-content-between w-100">
                    <h5>{users.username}</h5>
                    <h5 style={{ marginLeft: "16px" }}>{dateString}</h5>
                </div>
                {
                    decodedToken.username === users.username ?
                        <div className="w-70-pixels d-flex justify-content-between" style={{ marginLeft: "16px" }}>
                            <BiTrash size={25} color="white" onClick={toggleModalDelete}></BiTrash>
                            <Modal
                                isOpen={isOpenDelete}
                                onRequestClose={toggleModalDelete}
                                className="modal-dialog"
                                overlayClassName="position-fixed d-flex justify-content-center align-items-center top-0 left-0 right-0 bottom-0 w-100"
                                style={{ overlay: { zIndex: 3500, backgroundColor: "rgba(119, 119, 119, 0.8)" } }}
                            >
                                {
                                    !deleting ?
                                        <div className="modal-content bg-white border rounded p-2">
                                            <div className="modal-body p-2">
                                                <h2 className="modal-title">Are you sure you want to delete this comment?</h2>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary m-2" onClick={toggleModalDelete}>Cancel</button>
                                                <button type="button" className="btn btn-danger m-2" onClick={deletePost}>Delete</button>
                                            </div>
                                        </div>
                                        :
                                        <div className="modal-content bg-white border rounded p-2">
                                            <div className="modal-body p-2">
                                                <Loading message="Deleting"></Loading>
                                            </div>
                                        </div>
                                }
                            </Modal>

                            <BiEdit size={25} color="white" onClick={toggleModalEdit}></BiEdit>
                            <Modal
                                isOpen={isOpenEdit}
                                onRequestClose={toggleModalEdit}
                                className="modal-dialog w-75"
                                overlayClassName="position-fixed d-flex justify-content-center align-items-center top-0 left-0 right-0 bottom-0 w-100"
                                style={{ overlay: { zIndex: 3500, backgroundColor: "rgba(119, 119, 119, 0.8)" } }}
                            >
                                {
                                    !editing ?
                                        <div className="modal-content bg-white border rounded p-2">
                                            <div className="modal-body p-2">
                                                <h2 className="modal-title">Edit comment</h2>
                                                <textarea
                                                    className="form-control border border-1px-solid-777777 textarea-no-resize"
                                                    placeholder="Comment here"
                                                    value={editData.comment}
                                                    onChange={(e) => handleEditInputs(e, "comment")}
                                                ></textarea>
                                            </div>
                                            <div className="modal-footer">
                                                <button className="btn btn-secondary m-2" onClick={toggleModalEdit}>Cancel</button>
                                                <button className="btn btn-primary m-2" onClick={editPost} disabled={!editData.comment}>Save</button>
                                            </div>
                                        </div>
                                        :
                                        <div className="modal-content bg-white border rounded p-2">
                                            <div className="modal-body p-2">
                                                <Loading message="Editing"></Loading>
                                            </div>
                                        </div>
                                }
                            </Modal>
                        </div>
                        :
                        <></>
                }
            </div>
            <p className="p-3">{comment}</p>
        </div>
    )
};

export default PostModel;