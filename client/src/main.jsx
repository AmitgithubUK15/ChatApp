import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloProvider } from '@apollo/client';
import client from './ApilloClient/client.js';
import {Provider} from 'react-redux'
import { store,persistor } from '../redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate persistor={persistor}>
   <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  </PersistGate>
  </Provider>
  
)
