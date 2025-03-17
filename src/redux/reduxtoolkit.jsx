import { createSlice } from "@reduxjs/toolkit";

const userInitialState = {
  CurrentUserData: 'aaaaaaaaaaaaaa', // Corrected typo here
  UserState: "who know"
};

const wishlistInitialState = {
  wishlist: []
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

export const { setCurrentUserData, setUserState } = UserDataSlice.actions; // Corrected typo here
export const { setWishlist , removWishlist} = WishlistSlice.actions;
export const wishlistReducer = WishlistSlice.reducer;

export default UserDataSlice.reducer;