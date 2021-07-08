import * as R from "ramda";
import { reducers } from "./events/remote";

// APP STATE:
// user_flashcards: { "uuid": "flashcard" }
//
// quiz: {
//   questions: ["uuid", "uuid"]
//   answers: {
//     "uuid": "answer"
//   }
// }

const _reducer = (state, action) => {
  const { type } = action;

  const reducer = R.prop(type, reducers);
  if (reducer) {
    return reducer(state, action);
  } else {
    throw new Error(`Dispatched unknown action: ${type}`);
  }
};

const wrapDevLogger = (reducer) => {
  return (state, action) => {
    const newState = reducer(state, action);

    const groupName = `EVENT: ${action.type}`;
    console.groupCollapsed(groupName);
    console.log("ACTION", action);
    console.log("DB Before", state);
    console.log("DB After", newState);
    console.groupEnd(groupName);
    return newState;
  };
};

export const reducer = wrapDevLogger(_reducer);
