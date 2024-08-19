import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userSlcie from "./user/userSlice";
import {persistStore,persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ChatList from './chatinguserlist/ChatList';
import checkedUserslice from './chatinguserlist/checkedUserslice';
import searchuserSlice from './SearchUser/searchuserSlice';
import userRelatedDetails from './user/userRelatedDetails';


const rootreducer = combineReducers({
    user:userSlcie,
    chat:ChatList,
    checkeduser: checkedUserslice,
    searching: searchuserSlice,
    userdetails:userRelatedDetails,
})

const persistConfig = {
    key:'root',
    storage,
    blacklist: ['chat','checkeduser','searching','userdetails'],
}

const persisterReducer = persistReducer(persistConfig,rootreducer);

export const store = configureStore({
    reducer:persisterReducer,
    middleware:( getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:false,
    }),
})

export const persistor = persistStore(store);