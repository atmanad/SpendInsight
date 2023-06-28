import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api/v1";

const responseBody = (response) => response;

const requests = {
    get: (url) => axios.get(url).then(responseBody),
    post: (url, body) => axios.post(url, body).then(responseBody),
    put: (url, body) => axios.put(url, body).then(responseBody),
    del: (url) => axios.delete(url).then(responseBody),
    patch:(url,body) => axios.patch(url, body).then(responseBody), 
};

const Transaction = {
    list: () => requests.get("/transactions"),
    insert: (data) => requests.post("/transactions", data),
};

const api = {
    Transaction
};

export default api;