import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api/v1";
console.log("from api");
const responseBody = (response) => response;

const requests = {
    get: (url) => axios.get(url).then(responseBody),
    post: (url, body) => axios.post(url, body).then(responseBody),
    put: (url, body) => axios.put(url, body).then(responseBody),
    del: (url) => axios.delete(url).then(responseBody),
    patch: (url, body) => axios.patch(url, body).then(responseBody),
};

const Transaction = {
    list: (userId, selectedMonth) => requests.get(`/transactions?userId=${userId}&month=${selectedMonth}`),
    insert: (data) => requests.post("/transactions", data),
    listByMonth: (userId, selectedMonth) => requests.get(`/transactions/?userId=${userId}&selectedMonth=${selectedMonth}`),
    delete: (userId, transactionId,date) => requests.del(`/transactions?userId=${userId}&transactionId=${transactionId}&date=${date}`)
};

const Category = {
    list: (userId) => requests.get(`/categories/${userId}` ),
    insert: (data) => requests.post("/categories", data),
    delete: (data) => requests.del(`/categories/${data.userId}/${data.categoryId}`),
}

const Label = {
    list: (userId) => requests.get(`/labels/${userId}`),
    insert: (data) => requests.post("/labels", data),
    delete: (data) => requests.del(`/labels/${data.userId}/${data.labelId}`),
}

const Expense = {
    insert: (data) => requests.post("/expenses", data),
    update: (data) => requests.put("/expenses", data),
    fetch: (year, month) => requests.get(`/expenses/${year}/${month}`)
}

const api = {
    Transaction,
    Category,
    Label,
    Expense
};

export default api;