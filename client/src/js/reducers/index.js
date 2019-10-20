import { SEND_BODY } from "../constants/action-types";
import { ADD_CARS } from "../constants/action-types";
import {ADD_TAGS} from "../constants/action-types"
const initialState = {
  body: {},
  cars: [],
  tags: []
};
export default function rootReducer(state = initialState, action) {
  if (action.type === SEND_BODY) {
    return Object.assign({}, state, {
      body: action.payload
    });
  } else if (action.type === ADD_CARS) {
    return Object.assign({}, state, {
        cars: action.payload
      });
  } else if (action.type === ADD_TAGS) {
    return Object.assign({}, state, {
        tags: action.payload
      });
  }
  
  return state;
}
