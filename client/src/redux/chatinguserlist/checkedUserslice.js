import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    checkUser:[],
    checkedUserId:[],
}

const checkUser = createSlice({
    name: 'checkUser',
    initialState,
    reducers:{
        checkedUser_adding:(state,action) =>{
            if(action.payload.length > 0){
                let split = action.payload.split(",");
                state.checkUser.push(split);
                state.checkedUserId.push(split[1]);
            }
            else{
                state.checkUser = action.payload;
                state.checkedUserId = action.payload;
            }
            
        }
    }
})


export const {checkedUser_adding} = checkUser.actions;
export default checkUser.reducer;