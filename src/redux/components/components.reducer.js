import { addComponetsToItem, getBoundingAreaState } from "./components.utils";

const INITIAL_STATE = {
  componentsItems: {},
  getBoundingArea: {},
};

const componentsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_COMPONENT":
      return {
        ...state,
        componentsItems: addComponetsToItem(
          INITIAL_STATE.componentsItems,
          action.payload
        ),
      };
    case "GET_BOUNDING_AREA":
      return {
        ...state,
        getBoundingArea: getBoundingAreaState(
          INITIAL_STATE.getBoundingArea,
          INITIAL_STATE.componentsItems
        ),
      };
    default:
      return state;
  }
};

export default componentsReducer;
