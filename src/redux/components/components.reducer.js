import { addComponetsToItem, getBoundingArea } from "./components.utils";

const INITIAL_STATE = {
  componentsItems: [],
  getBoundingArea: []
};

const componentsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_COMPONENT":
      return {
        ...state,
        componentsItems: addComponetsToItem(
          state.componentsItems,
          action.payload
        )
      };
    case "GET_BOUNDING_AREA":
      return {
        ...state,
        getBoundingArea: getBoundingArea(state.componentsItems, action.payload)
      };
    default:
      return state;
  }
};

export default componentsReducer;
