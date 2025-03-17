import { configureStore } from '@reduxjs/toolkit';
import userDataReducer from './reduxtoolkit'; // Corrected import name
import { wishlistReducer } from './reduxtoolkit';   

export const mystore = configureStore({
  reducer: {
    UserData: userDataReducer, 
    wishlist: wishlistReducer
  }
});