import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.currentUser = action.payload;
        }
    }
})

export const {loginSuccess}  = userSlice.actions;
export default userSlice.reducer;