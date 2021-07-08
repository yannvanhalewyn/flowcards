import "./App.css";
import Flashcards from "./views/Flashcards";
import { useReducer } from "react";
import * as R from "ramda";

import { reducer } from "./state";
import { makeLoader, useRemoteData, getStatus, getData } from "./events/remote";

const flashcardsLoader = makeLoader({
  endpoint: "/flashcards.json",
  key: "userFlashcards",
  // Function that picks the flashcards key from response, then indexes the list
  // by their ID for easy access
  parseResponse: R.compose(R.indexBy(R.prop("id")), R.prop("flashcards")),
});

const App = () => {
  const [state, dispatch] = useReducer(reducer, {});

  // Load flashcards into appstate when component mounts
  useRemoteData(flashcardsLoader, dispatch);

  return (
    <div className="App">
      <span>FlowCards</span>
      <Flashcards
        flashcards={getData(state, flashcardsLoader)}
        status={getStatus(state, flashcardsLoader)}
      />
    </div>
  );
};

export default App;
