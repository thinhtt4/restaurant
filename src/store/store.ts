import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authSlice, { logout } from "@/store/authSlice";
import menuSlice from "@/store/menuSlice";
import profileSlice from "@/store/profileSlice";
import bookingSlice from "@/store/bookingSlice";
import bookingTableSlice from "@/store/bookingTableSlice";
import bookingHistorySlice from "@/store/bookingHistorySlice";
import { baseApi } from "./api/baseApi";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import chatSlice from "./chatSlice";

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  actionCreator: logout,
  effect: (_, listernApi) => {
    listernApi.dispatch(baseApi.util.resetApiState());
    persister.purge();

  }
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","chat"]
};

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authSlice,
  menu: menuSlice,
  profile: profileSlice,
  booking: bookingSlice,
  bookingHistory: bookingHistorySlice,
  chat: chatSlice,
  bookingTable: bookingTableSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    }).concat(baseApi.middleware).prepend(listenerMiddleware.middleware),
});


export const persister = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
