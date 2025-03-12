import { configureStore } from '@reduxjs/toolkit';
import UserDataSlice from './reduxtoolkit';

export const mystore = configureStore({
  reducer: { 
    UserData: UserDataSlice, // الاسم هنا سيحدد مسار الـ state
  }, 
});