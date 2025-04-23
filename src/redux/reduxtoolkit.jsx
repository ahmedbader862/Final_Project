import { createSlice } from "@reduxjs/toolkit";
import english from "./english";
import arabic from "./arabic";

const userInitialState = {
  UserState: "who know"
};
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const wishlistInitialState = {
  wishlist: []
};
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const FireDataInitialState = {
  FireData: []
};
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const LangeInitialState = {
  langue: "En",
  en: english,
  ar:arabic,
};

export const UserDataSlice = createSlice({
  name: 'UserData',
  initialState: userInitialState,
  reducers: {
    setCurrentUserData: (state, action) => { // Corrected typo here
      state.CurrentUserData = action.payload; // Corrected typo here
    },
    
    setUserState: (state, action) => {
      state.UserState = action.payload;
    }
  }
});

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


export const WishlistSlice = createSlice({
  name: 'Wishlist',
  initialState: wishlistInitialState, 
  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = [...state.wishlist,action.payload]; },


      removWishlist: (state, action) => {
        state.wishlist = state.wishlist.filter(wishlist => wishlist.title !== action.payload);
    },

    }
  }
);
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

export const FireDataSlice = createSlice({
  name: 'FireData',
  initialState: FireDataInitialState, 
  reducers: {
    setFireData: (state, action) => {
      state.FireData = [...state.FireData,action.payload]; },

    }
  }
);

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
export const LangeSlice = createSlice({
  name: 'Lange',
  initialState: LangeInitialState, 
  reducers: {
    setLange: (state, action) => {
      state.langue = action.payload; },

    }
  }
);

export const { setCurrentUserData, setUserState } = UserDataSlice.actions; 
export const { setWishlist , removWishlist} = WishlistSlice.actions;
export const { setFireData } = FireDataSlice.actions;
export const { setLange } = LangeSlice.actions;


export const wishlistReducer = WishlistSlice.reducer;
export const fireDataReducer = FireDataSlice.reducer;
export const langeReducer = LangeSlice.reducer;
export default UserDataSlice.reducer;