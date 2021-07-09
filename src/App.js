import { Suspense } from "react";
import { values } from "ramda";
import { useRecoilValue } from "recoil";

import logo from "./logo.svg";
import FlashcardsOverview from "./flashcard/Overview";
import { remoteFlashcards } from "./flashcard/model";
import { currentQuizAtom, useNewQuizMutation } from "./quiz/model";
import Quiz from "./quiz/Quiz";
import { resourcePath } from "./remote/model";

const Header = () => {
  return (
    <div className="flex items-center flex-col sm:flex-row sm:justify-between py-4 sm:mb-4">
      <div className="flex items-center">
        <img className="w-8 h-8" src={logo} alt={"Flowcards Logo"} />
        <span className="ml-2 font-bold text-2xl">FlowCards</span>
      </div>
      <a
        href="https://www.github.com/yannvanhalewyn/flowcards"
        target="_blank"
        rel="noreferrer"
        className="mt-4 sm:mt-0 px-4 py-1 rounded shadow bg-white hover:bg-gray-100"
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

/*
 * A nested component so that we can wrap this part of the app in a Suspense
 * block in the App component
 */
const App = () => {
  // Load flashcards into appstate when component mounts
  const flashcardsById = useRecoilValue(remoteFlashcards);
  const currentQuiz = useRecoilValue(currentQuizAtom);
  const startQuiz = useNewQuizMutation();

  return currentQuiz ? (
    <Quiz />
  ) : (
    <FlashcardsOverview
      flashcards={values(flashcardsById)}
      startQuiz={() => startQuiz(values(flashcardsById))}
    />
  );
};

const Spinner = () => <div>Loading...</div>;

const AppLayout = () => {
  return (
    <div className="px-4 pb-4 max-w-4xl mx-auto">
      <Header />
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    </div>
  );
};

export default AppLayout;
