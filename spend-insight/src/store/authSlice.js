import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:'auth',
    initialState:{isLoggedIn:false, user:null, token:null, userMetadata:null},
    reducers:{
        login(state, action){
            state.isLoggedIn = true;
            state.user = action.payload;
            sessionStorage.setItem('user', action.payload);
        },
        logout(state, action){
            state.isLoggedIn = false;
            state.user = null;
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            state.userMetadata = null;
        },
        addToken(state,action){
            state.token = action.payload;
            sessionStorage.setItem('token', action.payload);
        },
        addMetadata(state, action){
            state.userMetadata = action.payload;
        }
    }

})

export const authActions = authSlice.actions;
export default authSlice;