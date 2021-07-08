import { useEffect } from "react";
import { identity, path, assoc, assocPath, compose } from "ramda";

/*
 * A loader is an object describing how data should be fetched and stored in the
 * global app state. This object can then be used in different parts of the data
 * loading abstraction.
 * @param {[String]}   endpoint      - The URI path where the request should be sent.
 * @param {[String]}   key           - The key in the app state where the data
 *                                     should be stored
 * @param {[Function]} parseResponse - A function that preprocess the server's
 *                                     response before storing the data in the
 *                                     app state.
 */
export const makeLoader = ({ endpoint, key, parseResponse }) => {
  return { endpoint, key, parseResponse: parseResponse || identity };
};

/*
 * A react side effect that orchestrates and dispatches data loading according
 * to the loader. It will dispatch three events:
 *
 * REMOTE/FETCH   - Dispatched immediately
 * REMOTE/SUCCESS - Dispatched when server response was successful along with
 *                  pre-processed data according to the loaders
 * REMOTE/ERROR   - Dispatched when server response was failed
 *
 * @param {[Object]} loader   - The loader to be executed
 * @param {[Object]} dispatch - The dispatch function (usually for the
 *                              app-states reducer)
 */
export const useRemoteData = (loader, dispatch) => {
  useEffect(() => {
    const load = async () => {
      const response = await fetch(loader.endpoint);
      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: "REMOTE/SUCCESS",
          key: loader.key,
          data: loader.parseResponse(data),
        });
      } else {
        dispatch({ type: "REMOTE/ERROR", key: loader.key, data });
      }
    };
    dispatch({ type: "REMOTE/FETCH", key: loader.key });

    load();
  }, [loader, dispatch]);
};

/*
 * The reducers that handle the three data loading lifecycles.
 */
export const reducers = {
  "REMOTE/FETCH": (state, action) =>
    assocPath(["status", action.key], "STATUS/LOADING", state),

  "REMOTE/ERROR": (state, action) =>
    assocPath(["status", action.key], "STATUS/ERROR", state),

  "REMOTE/SUCCESS": (state, action) => {
    return compose(
      assoc(action.key, action.data),
      assocPath(["status", action.key], "STATUS/SUCCESS")
    )(state);
  },
};

export const getData = (state, loader) => {
  return [path([loader.key], state), path(["status", loader.key], state)];
};
export const isLoading = (status) => status === "STATUS/LOADING";
export const isSuccess = (status) => status === "STATUS/SUCCESS";
