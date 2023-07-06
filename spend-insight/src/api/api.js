import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api/v1";

const responseBody = (response) => response;

const requests = {
    get: (url) => axios.get(url).then(responseBody),
    post: (url, body) => axios.post(url, body).then(responseBody),
    put: (url, body) => axios.put(url, body).then(responseBody),
    del: (url) => axios.delete(url).then(responseBody),
    patch: (url, body) => axios.patch(url, body).then(responseBody),
};

const Transaction = {
    list: () => requests.get("/transactions"),
    insert: (data) => requests.post("/transactions", data),
    listByMonth: (startDate, endDate) => requests.get(`/transactions/month/${startDate}/${endDate}`),
    delete: (transactionId) => requests.del(`transactions/${transactionId}`)
};

const Category = {
    list: () => requests.get("/categories"),
    insert: (data) => requests.post("/categories", data),
    delete: (categoryId) => requests.del(`/categories/${categoryId}`),
}

const Label = {
    list: () => requests.get("/labels"),
    insert: (data) => requests.post("/labels", data),
    delete: (labelId) => requests.del(`/labels/${labelId}`),
}

const api = {
    Transaction,
    Category,
    Label
};

export default api;