import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import componentsReducer from "./components/components.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["components"]
};

const rootReducer = combineReducers({
  components: componentsReducer
});

export default persistReducer(persistConfig, rootReducer);
