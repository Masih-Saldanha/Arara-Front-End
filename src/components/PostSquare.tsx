import React from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../redux/hook";
import { editComment } from "../redux/postSlice";
import { getFreshPosts } from "../redux/postListSlice";
import networkRequests from "../actions/networkRequests";

function PostSquare() {
    const commentText = useAppSelector((state) => state.postReducer.commentText);
    const postButtonDisabled = useAppSelector((state) => state.postReducer.postButtonDisabled);
    const localStorageToken = useAppSelector((state) => state.signInReducer.localStorageToken);

    const decodedToken = networkRequests.returnDecodedToken(localStorageToken);

    const dispatch = useDispatch();

    function handleContent(e: { target: { value: any; }; }) {
        dispatch(editComment(e.target.value));
    };

    function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        networkRequests
            .postText(commentText, decodedToken.id, localStorageToken)
            .then((response) => {
                networkRequests
                    .getPosts(0, localStorageToken)
                    .then((response) => {
                        dispatch(getFreshPosts(response.data));
                        dispatch(editComment(""));
                    })
                    .catch((e) => {
                        alert("could not retrieve new comments");
                    });
            })
            .catch((e) => {
                alert("could not send your comment");
            });
    };

    return (
        <article className="border border-1px-solid-999999 rounded p-3 m-4">
            <form onSubmit={handleSubmit}>
                <h2 className="mb-3">What’s on your mind?</h2>
                <textarea
                    className="form-control border border-1px-solid-777777 mb-3 textarea-no-resize"
                    placeholder="Comment here"
                    value={commentText}
                    onChange={handleContent}
                ></textarea>
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={postButtonDisabled}
                    >Create</button>
                </div>
            </form>
        </article>
    )
};

export default PostSquare;