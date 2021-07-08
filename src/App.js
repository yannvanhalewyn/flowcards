import { useReducer } from "react";
import { values, prop, compose, indexBy } from "ramda";

import logo from "./logo.svg";
import FlashcardsOverview from "./flashcard/Overview";
import Quiz from "./quiz/Quiz";
import { reducer } from "./state";
import { resourcePath } from "./resource";
import { makeLoader, useRemoteData, getData } from "./remote/events";

const flashcardsLoader = makeLoader({
  endpoint: "/flashcards.json",
  key: "userFlashcards",
  // Function that picks the flashcards key from response, then indexes the list
  // by their ID for easy access
  parseResponse: compose(indexBy(prop("id")), prop("flashcards")),
});

const Header = () => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <img className="w-8 h-8" src={logo} alt={"Flowcards Logo"} />
        <span className="ml-2 font-bold text-2xl">FlowCards</span>
      </div>
      <a
        href="https://www.github.com/yannvanhalewyn/flowcards"
        target="_blank"
        rel="noreferrer"
        className="px-4 py-1 rounded shadow bg-white hover:bg-gray-100"
      >
        <span className="text-sm">View source on</span>
        <img
          className="inline h-6 w-6 ml-2"
          src={resourcePath("/img/github-logo.png")}
          alt="Github Logo"
        />
      </a>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {});

  // Load flashcards into appstate when component mounts
  useRemoteData(flashcardsLoader, dispatch);
  const [flashcardsById, status] = getData(state, flashcardsLoader);

  return (
    <div className="px-4 pb-4 max-w-4xl mx-auto">
      <Header />
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
