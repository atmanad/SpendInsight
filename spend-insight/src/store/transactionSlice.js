import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
    name:'transaction',
    initialState:{isLoggedIn:false, sub:null},
    reducers:{
        login(state, action){
            state.isLoggedIn = true;
            state.sub = action.payload;
            sessionStorage.setItem('sub', action.payload);
        },
        logout(state){
            state.isLoggedIn = false;
            state.sub = null;
            sessionStorage.removeItem('sub');
        }
    }

})

export const transactionActions = transactionSlice.actions;
export default transactionSlice;