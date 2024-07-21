import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userSlcie from "./user/userSlice";
import {persistStore,persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ChatList from './chatinguserlist/ChatList';


const rootreducer = combineReducers({
    user:userSlcie,
    chat:ChatList
})

const persistConfig = {
    key:'root',
    storage,
}

const persisterReducer = persistReducer(persistConfig,rootreducer);

export const store = configureStore({
    reducer:persisterReducer,
    middleware:( getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:false,
    }),
})

export const persistor = persistStore(store);