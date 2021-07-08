import "./App.css";
import FlashcardsOverview from "./flashcard/Overview";
import { useReducer } from "react";
import { values, prop, compose, indexBy } from "ramda";

import Quiz from "./quiz/Quiz";
import { reducer } from "./state";
import { makeLoader, useRemoteData, getData } from "./remote/events";

const flashcardsLoader = makeLoader({
  endpoint: "/flashcards.json",
  key: "userFlashcards",
  // Function that picks the flashcards key from response, then indexes the list
  // by their ID for easy access
  parseResponse: compose(indexBy(prop("id")), prop("flashcards")),
});

const App = () => {
  const [state, dispatch] = useReducer(reducer, {});

  // Load flashcards into appstate when component mounts
  useRemoteData(flashcardsLoader, dispatch);
  const [flashcardsById, status] = getData(state, flashcardsLoader);

  return (
    <div className="App">
      <span>FlowCards</span>
      {state.currentQuiz ? (
        <Quiz
          flashcardsById={flashcardsById}
          currentQuiz={state.currentQuiz}
          dispatch={dispatch}
        />
      ) : (
        <FlashcardsOverview
          flashcards={values(flashcardsById)}
          status={status}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default App;
