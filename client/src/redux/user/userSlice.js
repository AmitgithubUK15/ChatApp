import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    S_UID:null,
    ChatDisplay:false,
    LogoutUser:null,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.S_UID = action.payload;
        },
        logout:(state) =>{
            state.S_UID = null;
            state.LogoutUser = null;
        },
        ShowChatdisplay:(state)=>{
            state.ChatDisplay = true;
        },
        SessionExpried_Logout : (state,action)=>{
           state.LogoutUser = action.payload;
        }
    }
})

export const {loginSuccess,ShowChatdisplay,logout,SessionExpried_Logout}  = userSlice.actions;
export default userSlice.reducer;