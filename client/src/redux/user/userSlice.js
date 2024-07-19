import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    S_UID:null,
    ChatDisplay:false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.S_UID = action.payload;
        },
        ShowChatdisplay:(state)=>{
            state.ChatDisplay = true;
        }
    }
})

export const {loginSuccess,ShowChatdisplay}  = userSlice.actions;
export default userSlice.reducer;