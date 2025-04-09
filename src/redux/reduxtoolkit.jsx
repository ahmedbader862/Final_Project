import { createSlice } from "@reduxjs/toolkit";

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

export const { setCurrentUserData, setUserState } = UserDataSlice.actions; // Corrected typo here
export const { setWishlist , removWishlist} = WishlistSlice.actions;
export const { setFireData } = FireDataSlice.actions;


export const wishlistReducer = WishlistSlice.reducer;
export const fireDataReducer = FireDataSlice.reducer;
export default UserDataSlice.reducer;