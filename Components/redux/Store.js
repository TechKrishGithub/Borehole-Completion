import {combineReducers,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './Reducers';
import { createStoreHook } from 'react-redux';

const rootReducer=combineReducers({userReducer});

export const Store=createStoreHook(rootReducer,applyMiddleware({thunk}))
