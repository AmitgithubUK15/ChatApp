import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentuser: null
}

const current_chat_user = createSlice({
    name:"current_chating_user",
    initialState,
    reducers:{
        setCurrentUser: (state, action)=>{
            state.currentuser = action.payload;
        }
    }
})

export const {setCurrentUser} = current_chat_user.actions;
export default current_chat_user.reducer;