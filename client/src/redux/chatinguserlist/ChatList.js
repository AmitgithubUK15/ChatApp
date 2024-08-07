import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Chat:null,
    hideNotification:null,
    file_url_for_review:null,
    fileData:null,
    doc_file:null,
    showImage_sending_Slide: false,
    ShowImage_In_ChatBox : null
}

const ChatlistSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        Update_User_Chatlist: (state,action)=>{
           state.Chat = action.payload;
        },
        Hide_Msg_Notification : (state,action)=>{
           state.hideNotification = action.payload;
        },
        Send_File : (state,action) =>{
           state.file_url_for_review = action.payload;
           state.showImage_sending_Slide = true;
        },
        Send_File_Data:(state,action) =>{
            state.fileData = action.payload;
        },
        HideImage_Sending_slide:  (state)=>{
            state.showImage_sending_Slide = false;
            state.file_url_for_review = null;
            state.doc_file = null;
            state.fileData = null;
            state.ShowImage_In_ChatBox  = null;
        },
        Send_Docs :(state,action) =>{
            state.doc_file = action.payload;
            state.showImage_sending_Slide = true;
        },
        FileShow_On_ChatBox : (state,action) =>{
            state.ShowImage_In_ChatBox = action.payload;
        },
        HideImageReview_Box_NotClear_ExitingValue : (state)=>{
            state.showImage_sending_Slide = false;
        }
    }
})

export const 
{Update_User_Chatlist,
Hide_Msg_Notification,
Send_File,
HideImage_Sending_slide,
Send_Docs,
Send_File_Data,
FileShow_On_ChatBox,
HideImageReview_Box_NotClear_ExitingValue}         = ChatlistSlice.actions;
export default ChatlistSlice.reducer;