import React from "react";
import { map, isEmpty } from "ramda";
import Questionaire from "./Questionaire";
import * as Quiz from "./model.js";

const ErrorLine = (error) => {
  return (
    <li key={error.id}>
      {error.answer} => {error.solution}
    </li>
  );
};

const QuizReport = ({ currentQuiz, flashcardsById, dispatch }) => {
  const report = Quiz.report(currentQuiz, flashcardsById);
  const [num, denom] = report.score;

  return (
    <div>
      <h1>Congratulations!</h1>
      <p>
        You have finished the quiz. Your score was: {num} out of {denom}!
      </p>
      {isEmpty(report.errors) ? (
        <p>You didn't make a single mistake!</p>
      ) : (
        <React.Fragment>
          <p>You made these mistakes:</p>
          <ul>{map(ErrorLine, report.errors)}</ul>
        </React.Fragment>
      )}
      <button onClick={() => dispatch({ type: "QUIZ/CLOSE" })}>Go back</button>
    </div>
  );
};

const QuizComponent = (props) => {
  const { currentQuiz } = props;
  // currentQuiz.isFinished = true;
  if (currentQuiz.isFinished) {
    return <QuizReport {...props} />;
  }
  return <Questionaire {...props} />;
};

export default QuizComponent;
