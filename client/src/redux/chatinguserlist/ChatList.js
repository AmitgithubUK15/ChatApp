import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Chat:null,
    hideNotification:null,
}

const ChatlistSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        Update_User_Chatlist: (state,action)=>{
           state.Chat = action.payload;
        },
        Hide_Msg_Notification : (state,action)=>{
           state.hideNotification = action.payload;
        }
    }
})

export const {Update_User_Chatlist,Hide_Msg_Notification} = ChatlistSlice.actions;
export default ChatlistSlice.reducer;