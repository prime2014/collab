import { legacy_createStore as createStore } from 'redux';
import { combineReducers, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import {
    userReducer,
    channelReducer,
} from "./reducers/reducers";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";


const persistConfig = {
    key: 'uncensored',
    storage,
    whitelist: [
        "userReducer",
        "channelReducer",
    ],
    transforms: [
        encryptTransform({
          secretKey: 'my-super-secret-key',
          onError: function (error) {
            // Handle the error.
          },
        }),
    ],
}


let rootReducer = combineReducers({
    userReducer,
    channelReducer,
})

let persistedReducer = persistReducer(persistConfig, rootReducer)


const store = createStore(persistedReducer, applyMiddleware(thunk))
const persistor = persistStore(store)

export const store_settings = {
    store,
    persistor
}
