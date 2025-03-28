// import { configureStore } from "@reduxjs/toolkit";
// import campaignReducer from "./campaignSlice";
// import storage from "redux-persist/lib/storage"; // Uses localStorage
// import { persistReducer, persistStore } from "redux-persist";

// const persistConfig = {
//   key: "campaign",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, campaignReducer);

// export const store = configureStore({
//   reducer: {
//     campaign: persistedReducer, // Persist the campaign slice
//   },
// });

// export const persistor = persistStore(store);
// export default store;

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import campaignReducer from "./campaignSlice";

const persistConfig = {
  key: "campaign",
  storage,
};

const persistedReducer = persistReducer(persistConfig, campaignReducer);

export const store = configureStore({
  reducer: {
    campaign: persistedReducer, // Persist the campaign slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore persist actions to remove warning
      },
    }),
});

export const persistor = persistStore(store);
export default store;
