import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';

const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
        // transaction:
    },    
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
          // Configuration object for getDefaultMiddleware
          serializableCheck: false, // Disable the serializable check
        });
      },
})

export default store;