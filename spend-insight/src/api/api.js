import axios from "axios";

axios.defaults.baseURL = "https://localhost:7149/api/v1/tweets";

// "https://apitweetapp.azure-api.net/apitweet/api/v1/tweets"
//"https://backendtweet.azurewebsites.net/api/v1/tweets";
// "https://localhost:7149/api/v1/tweets";
// "https://backendtweet.azurewebsites.net/api/v1/tweets"

const responseBody = (response) => response.data;

const requests = {
    get: (url) => axios.get(url).then(responseBody),
    post: (url, body) => axios.post(url, body).then(responseBody),
    put: (url, body) => axios.put(url, body).then(responseBody),
    del: (url) => axios.delete(url).then(responseBody),
    patch:(url,body) => axios.patch(url, body).then(responseBody), 
};

const User = {
    list: () => requests.get("/users/all"),
    login: (creds) => requests.post("/login", creds),
    register: (creds) => requests.post("/register", creds),
    search: (username) => requests.get(`/search/${username}`),
    current: () => requests.get("/currentuser"),
    forgotPassword:(username, body) => requests.patch(`/forgot/${username}`, body)
};

const Tweet = {
    list: () => requests.get("/all"),
    listTweetOfUser: (username) =>
        requests.get(`/${username}`),
    createTweet: (tweetObj, username) =>
        requests.post(`/${username}/add`, tweetObj),
    details: (id) => requests.get(`/details/${id}`),
    delete: (username, id) =>
        requests.del(`/${username}/delete/${id}`),
    update: (username, id, body) =>
        requests.put(`/${username}/update/${id}`, body),
    countLikes: (id) => requests.get(`/like/${id}`),
    likeDetails: () => requests.get(`/reactions`),
    postLike: (id, username) =>
        requests.post(`/${username}/like/${id}`),
    commentDetails: () => requests.get("/replies"),
    postComment: (id, username, message) =>
        requests.post(`${username}/reply/${id}`, message),
};

const api = {
    User,
    Tweet,
};

export default api;