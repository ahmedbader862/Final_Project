import { configureStore } from '@reduxjs/toolkit';
import userDataReducer, { fireDataReducer } from './reduxtoolkit'; // Corrected import name
import { wishlistReducer } from './reduxtoolkit';   

export const mystore = configureStore({
  reducer: {
    UserData: userDataReducer, 
    wishlist: wishlistReducer,
    fireData:fireDataReducer
    
  }
});