import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showMsg_Info_component: false
};

const MsgInfoComponent = createSlice({
    name:"msginfo",
    initialState,
    reducers:{
        showMsgInfo : (state,action) =>{
            state.showMsg_Info_component = action.payload;
        }
    }
})

export const {showMsgInfo} = MsgInfoComponent.actions;
export default MsgInfoComponent.reducer;