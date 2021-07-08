import { useState } from "react";
import React from "react";
import Icon from "@mdi/react";
import { mdiCloseThick, mdiCheck, mdiCheckBold } from "@mdi/js";
import { prop, path } from "ramda";
import * as Quiz from "./model.js";
import * as Flashcard from "../flashcard/model.js";

const QuestionReport = ({
  quiz,
  flashcard,
  answer,
  onNextQuestion,
  onFinishQuiz,
}) => {
  const nextQuestion = Quiz.getNextQuestion(quiz);

  const InlineIcon = ({ path, className }) => (
    <Icon
      className={`inline-block -mt-1 mr-2 w-5 h-5 ${className}`}
      path={path}
    />
  );

  return (
    <div className="mt-4">
      {Flashcard.isCorrect(flashcard, answer) ? (
        <p>
          <InlineIcon className="text-green-500" path={mdiCheckBold} />
          <span className="font-bold text-green-500">Correct!</span>
        </p>
      ) : (
        <React.Fragment>
          <p className="text-gray-700">
            <InlineIcon className="text-green-500" path={mdiCheckBold} />
            The correct answer was{" "}
            <span className="font-bold text-green-500">
              {" "}
              {flashcard.solution}{" "}
            </span>
          </p>

          <p className="mt-2">
            <InlineIcon path={mdiCloseThick} className="text-red-500" />
            You replied <span className="font-bold text-red-500">{answer}</span>
          </p>
        </React.Fragment>
      )}
      {nextQuestion ? (
        <button className="btn btn--blue mt-4" onClick={onNextQuestion}>
          Next Question
        </button>
      ) : (
        <button className="btn btn--blue mt-4" onClick={onFinishQuiz}>
          See how you've done!
        </button>
      )}
    </div>
  );
};

const QuestionInput = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  return (
    <React.Fragment>
      <form className="mt-8" onSubmit={() => onSubmit(input)}>
        <input
          className="border-b-2 w-full outline-none border-gray-200"
          type="text"
          autoFocus={true}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </React.Fragment>
  );
};

const Questionaire = ({ currentQuiz, flashcardsById, dispatch }) => {
  const currentFlashcardId = currentQuiz.currentQuestion;
  const currentFlashcard = prop(currentFlashcardId, flashcardsById);
  const submittedAnswer = path(["answers", currentFlashcardId], currentQuiz);

  return (
    <div className="mt-8 p-8 bg-white rounded">
      <h2 className="inline-block font-bold text-xl border-l-4 pl-4 border-yellow-300">
        {currentFlashcard.prompt}
      </h2>
      {submittedAnswer ? (
        <QuestionReport
          quiz={currentQuiz}
          flashcard={currentFlashcard}
          answer={submittedAnswer}
          onNextQuestion={() => dispatch({ type: "QUIZ/NEXT_QUESTION" })}
          onFinishQuiz={() => dispatch({ type: "QUIZ/FINISH" })}
        />
      ) : (
        <QuestionInput
          onSubmit={(answer) =>
            dispatch({
              type: "QUIZ/ANSWER_QUESTION",
              flashcardId: currentFlashcardId,
              answer,
            })
          }
        />
      )}
    </div>
  );
};

export default Questionaire;
