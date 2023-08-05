import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/api/v1";
// axios.defaults.baseURL = "https://spend-insight-server.vercel.app/api/v1"
const responseBody = (response) => response;

const apiUrl = "https://spend-insight.us.auth0.com/api/v2";


const fetchRequest = (method) => async (url, token, body = null) => {
    console.log(body);
    const requestOptions = {
        method,
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${apiUrl}${url}`, requestOptions);
    if (!response.ok) {
        console.error(response.status, response.statusText);
    }
    return await response.json();
};

const auth0Requests = {
    get: fetchRequest("GET"),
    post: fetchRequest("POST"),
    put: fetchRequest("PUT"),
    del: fetchRequest("DELETE"),
    patch: fetchRequest("PATCH"),
};

var options = {
    method: 'POST',
    url: 'https://spend-insight.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },

    body: { "client_id": "Nirp01mxs3XbFyXa62dXg2pbveI9EA", "client_secret": "YTpNRJz5_ayC1-AwB8NiFK0PGqeAIYP8pWkY4r9PjZmn7nMPAmtWXmeWTS4XCz", "audience": "https://spend-insight.us.auth0.com/api/v2/", "grant_type": "client_credentials" }

};

const fetchManagementApiToken = async () => {
    const response = await fetch('https://spend-insight.us.auth0.com/oauth/token', options);
    if (!response.ok) {
        console.error(response.status, response.statusText);
    }

    return response.json();
}

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
    delete: (userId, transactionId, date) => requests.del(`/transactions?userId=${userId}&transactionId=${transactionId}&date=${date}`)
};

const Category = {
    list: (userId) => requests.get(`/categories/${userId}`),
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

const Income = {
    fetch: (userId, date) => requests.get(`/income?userId=${userId}&date=${date}`),
    insert: (data) => requests.post("/income", data),
    delete: (userId, incomeId, date) => requests.del(`/income/?userId=${userId}&incomeId=${incomeId}&date=${date}`),
}

const User = {
    fetch: (userId, token) => auth0Requests.get(`/users/${userId}`, token),
    updateName: (userId, token, body) => auth0Requests.patch(`/users/${userId}`, token, body)
}

const api = {
    Transaction,
    Category,
    Label,
    Expense,
    Income,
    User,
    fetchManagementApiToken
};

export default api;