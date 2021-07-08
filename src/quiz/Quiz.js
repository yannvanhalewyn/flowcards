import React from "react";
import { map, isEmpty } from "ramda";
import Questionaire from "./Questionaire";
import { AnswerAndSolution } from "./Questionaire";
import * as Quiz from "./model";
import * as QuizEvents from "./events"
import { DashedHeading } from "../Typography";

const ErrorLine = (error) => {
  return (
    <li key={error.id} className="mt-6 border-l-4 pl-4 border-yellow-300">
      <h2 className="text-xl font-bold">{error.prompt}</h2>
      <div className="mt-2">
        <AnswerAndSolution flashcard={error} answer={error.answer} />
      </div>
    </li>
  );
};

const QuizReport = ({ currentQuiz, flashcardsById, dispatch }) => {
  const report = Quiz.report(currentQuiz, flashcardsById);
  const [num, denom] = report.score;

  return (
    <div className="mt-8 p-8 bg-white rounded animation-appear">
      <h1 className="font-bold text-xl">All done!</h1>
      <p className="mt-4 text-gray-800">
        You have finished the quiz. Your score was{" "}
        <span className="font-bold">{num}</span> out of{" "}
        <span className="font-bold">{denom}</span>!
      </p>
      {isEmpty(report.errors) ? (
        <p className="mt-2 font-bold text-green-500">
          You didn't make a single mistake!
        </p>
      ) : (
        <ul className="mt-2">{map(ErrorLine, report.errors)}</ul>
      )}
      <button
        className="mt-4 underline text-blue-500"
        onClick={() => dispatch(QuizEvents.close())}
      >
        ‹ Go back
      </button>
    </div>
  );
};

const QuizComponent = (props) => {
  const { currentQuiz } = props;

  if (currentQuiz.isFinished) {
    return (
      <div className="mt-4">
        <DashedHeading>See your results</DashedHeading>
        <QuizReport {...props} />
      </div>
    );
  }
  return (
    <div className="mt-4">
      <DashedHeading>Take the quiz</DashedHeading>
      <Questionaire {...props} />;
    </div>
  );
};

export default QuizComponent;
