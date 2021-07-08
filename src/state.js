import { prop, mergeAll } from "ramda";
import { reducers as remoteReducers } from "./remote/events";
import { reducers as quizReducers } from "./quiz/events";

// APP STATE:
// userFlashcards: { "uuid": "flashcard" }
//
// currentQuiz: {
//   questions: ["uuid", "uuid"]
//   answers: {
//     "uuid": "answer"
//   }
// }

const allReducers = mergeAll([remoteReducers, quizReducers]);

const _reducer = (state, action) => {
  const { type } = action;

  const reducer = prop(type, allReducers);
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
