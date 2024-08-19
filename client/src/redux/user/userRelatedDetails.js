import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentuser:null,
}

const userDetails = createSlice({
    name:"userdetails",
    initialState,
    reducers:{
        setUserDetails: (state,action)=>{
            state.currentuser = action.payload;
        }
    }
})

export const {setUserDetails} = userDetails.actions;
export default userDetails.reducer;