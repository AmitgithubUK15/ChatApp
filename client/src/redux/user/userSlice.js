import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    S_UID:null,
    
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.S_UID = action.payload;
        },
    }
})

export const {loginSuccess}  = userSlice.actions;
export default userSlice.reducer;