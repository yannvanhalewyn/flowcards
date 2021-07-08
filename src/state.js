import { prop, mergeAll } from "ramda";
import { reducers as remoteReducers } from "./remote/events";
import { reducers as quizReducers } from "./quiz/events";

const allReducers = mergeAll([remoteReducers, quizReducers]);

/*
 * The main 'reducer'. Combines all reducers found in the project and delegates
 * an incoming action to the correct one.
 */
const _reducer = (state, action) => {
  const { type } = action;

  const reducer = prop(type, allReducers);
  if (reducer) {
    return reducer(state, action);
  } else {
    throw new Error(`Dispatched unknown action: ${type}`);
  }
};

/*
 * A logger for in development logging every every event and relevant
 * information such as state changes and action payload. Intentionally left on
 * for production builds for easy introspection.
 */
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
