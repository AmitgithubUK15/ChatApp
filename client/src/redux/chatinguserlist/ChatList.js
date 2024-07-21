import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Chat:null
}

const ChatlistSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        Update_User_Chatlist: (state,action)=>{
           state.Chat = action.payload;
        }
    }
})

export const {Update_User_Chatlist} = ChatlistSlice.actions;
export default ChatlistSlice.reducer;