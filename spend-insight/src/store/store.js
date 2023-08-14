import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import transactionSlice from './transactionSlice';

const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
        transaction:transactionSlice.reducer
    },    
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
          // Configuration object for getDefaultMiddleware
          serializableCheck: false, // Disable the serializable check
        });
      },
})

export default store;