import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showMsg_Info_component: false
};

const MsgInfoComponent = createSlice({
    name:"msginfo",
    initialState,
    reducers:{
        showMsgInfo : (state) =>{
            if(state.showMsg_Info_component){
                state.showMsg_Info_component = false;
            }
            else{
                state.showMsg_Info_component = true;
            }
        }
    }
})

export const {showMsgInfo} = MsgInfoComponent.actions;
export default MsgInfoComponent.reducer;