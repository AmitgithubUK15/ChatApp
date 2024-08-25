import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visible_userdetailspage : false
}

const UserDetailspagevisible = createSlice({
    name:"userdetailpage",
    initialState,
    reducers:{
        showUserDetailspage : (state,action) =>{
            state.visible_userdetailspage = action.payload;
        }
    }
})

export const {showUserDetailspage} = UserDetailspagevisible.actions;
export default UserDetailspagevisible.reducer;