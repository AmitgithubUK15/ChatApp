import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Chat:null,
    hideNotification:null,
    file_url_for_review:null,
    fileData:null,
    doc_file:null,
    showImage_sending_Slide: false,
    ShowImage_In_ChatBox : null,
    MsgSettingDropDown: false,
    selectedmsg : null,
    Selection_Check_Visible : false,
    clear_checkMsgstate: null,
    remove_msg_from_UI: false,
    Chating_user_setting_dropdown: false,
    ShowcheckBox_userlist :false,
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
        },
        ShowMsgSettingDropDownBox : (state,action) =>{
            state.MsgSettingDropDown = action.payload;
        },
        ShowCheckBoxs_Visiblity : (state,action)=>{
            state.Selection_Check_Visible = action.payload;
            state.selectedmsg = null;
            if(!state.clear_checkMsgstate){
                state.clear_checkMsgstate = true;
                state.MsgSettingDropDown = false
            }
            else{
                state.clear_checkMsgstate = false;
                state.MsgSettingDropDown = false;
            }
        },
        Selected_Msgs: (state,action) => {
            state.selectedmsg = action.payload;
        },
        remove_ui_msg: (state)=>{
            if(!state.remove_msg_from_UI){
                state.remove_msg_from_UI = true;
                state.MsgSettingDropDown = false;
                state.Selection_Check_Visible = false;
            }
            else{
                state.remove_msg_from_UI = false;
                state.MsgSettingDropDown = false;
                state.Selection_Check_Visible = false;
            }
        },
        ShowChatingList_dropdown: (state,action)=>{
            state.Chating_user_setting_dropdown = action.payload;
        },

        SelectUser:(state,action)=>{
            state.ShowcheckBox_userlist = action.payload;
            state.Chating_user_setting_dropdown = false;
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
HideImageReview_Box_NotClear_ExitingValue,
ShowMsgSettingDropDownBox,
Selected_Msgs,
ShowCheckBoxs_Visiblity,
remove_ui_msg,
ShowChatingList_dropdown,
SelectUser
}         = ChatlistSlice.actions;
export default ChatlistSlice.reducer;