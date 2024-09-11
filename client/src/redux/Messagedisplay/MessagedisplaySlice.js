import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visibledisplay:false,
    visiblechatlist : true,
}

const MessageDisplaySlice = createSlice({
    name: 'MessageDisplay',
    initialState,
    reducers:{
        showMessageDisplay: (state,action) =>{
            state.visibledisplay = action.payload;
            state.visiblechatlist = false;

        },
        chatinguserLists: (state,action) =>{
            state.visiblechatlist = action.payload;
            
        }
        
    }
})

export const {showMessageDisplay,chatinguserLists} = MessageDisplaySlice.actions;
export default MessageDisplaySlice.reducer;