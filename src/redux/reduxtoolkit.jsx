import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  CurentUserData: 'aaaaaaaaaaaaaa',
  UserState : "who know"
};

export const UserDataSlice = createSlice({
  name: 'UserData',
  initialState,
  reducers: {
    setCurentUserData: (state, action) => {
      state.UserData = action.payload;
    },

    setUserState:(state , action) =>{
      state.UserState = action.payload;
    }

  },
});

export const { setCurentUserData , setUserState} = UserDataSlice.actions;
export default UserDataSlice.reducer;