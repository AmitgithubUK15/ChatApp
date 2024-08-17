import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchquery :null,
}

const serachusersSlice = createSlice({
    name:"searchusers",
    initialState,
    reducers:{
        search:(state,action)=>{
            console.log(state.searchquery)
            state.searchquery = action.payload;
        }
    }
})

export const {search} = serachusersSlice.actions;
export default serachusersSlice.reducer;
