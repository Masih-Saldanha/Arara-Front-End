import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = "https://certi-amazonia-chat.onrender.com";

function getAxiosConfig(token: string) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

function returnDecodedToken(token: string): { iat: number, id: number, username: string } {
    if (!token) {
        return null
    };
    return jwt_decode(token);
};

function signUp(username: string, password: string) {
    return axios.post(`${BASE_URL}/auth/signup`, { username, password });
};

function signIn(username: string, password: string) {
    return axios.post(`${BASE_URL}/auth/signin`, { username, password });
};

function postText(comment: string, userId: number, token: string) {
    const config = getAxiosConfig(token);
    return axios.post(`${BASE_URL}/comment/register`, { comment, userId }, config);
};

function editPost(comment: string, userId: number, commentId: number, token: string) {
    const config = getAxiosConfig(token);
    return axios.put(`${BASE_URL}/comment/edit`, { comment, userId, commentId }, config);
};

function deletePost(commentId: number, token: string) {
    const config = getAxiosConfig(token);
    return axios.delete(`${BASE_URL}/comment/delete/${commentId}`, config);
};

function getPosts(page: number, token: string) {
    const config = getAxiosConfig(token);
    return axios.get(`${BASE_URL}/comment/get/${page}`, config);
};

const networkRequests = {
    returnDecodedToken,
    signUp,
    signIn,
    postText,
    editPost,
    deletePost,
    getPosts,
};

export default networkRequests;