import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

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
        <PostArticle>
            <form onSubmit={handleSubmit}>
                <h2>What’s on your mind?</h2>
                <textarea
                    placeholder="Content here"
                    value={commentText}
                    onChange={handleContent}
                ></textarea>
                <ButtonBox>
                    <button
                        type="submit"
                        disabled={postButtonDisabled}
                    >Create</button>
                </ButtonBox>
            </form>
        </PostArticle>
    )
};

const PostArticle = styled.article`
    border: 1px solid #999999;
    border-radius: 16px;
    padding: 24px;
    margin: 24px;
    form {
        h2 {
            margin-bottom: 24px;
        }
        h3 {
            margin-bottom: 8px;
        }
        input {
            border: 1px solid #777777;
            margin-bottom: 24px;
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
            margin-bottom: 24px;
            padding: 8px;
            font-size: 14px;
        }
        textarea::placeholder {
            font-size: 14px;
            color: #CCCCCC;
        }
    }
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: end;
    button {
        /* background-color: ${(props: { children: { props: { color: any; }; }; }) => props.children.props.color}; */
        color: #FFFFFF;
        :hover {
            background-color: ${(props) => props.children.props.disabled === true ? "" : "green"};
            color: white;
        }
    }
`

export default PostSquare;