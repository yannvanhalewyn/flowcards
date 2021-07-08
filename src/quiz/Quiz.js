import { useState } from "react";
import React from "react";
import { map, prop, path, isEmpty } from "ramda";
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

  return (
    <div>
      {Flashcard.isCorrect(flashcard, answer)
        ? "Success!"
        : `Failed! Expected ${flashcard.solution} but you guessed ${answer}`}
      {nextQuestion ? (
        <button onClick={onNextQuestion}>Next Question</button>
      ) : (
        <button onClick={onFinishQuiz}>See how you've done!</button>
      )}
    </div>
  );
};

const QuestionInput = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  return (
    <React.Fragment>
      <form onSubmit={() => onSubmit(input)}>
        <input
          className="flashcard__input mt-8"
          type="text"
          autoFocus={true}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>Guess!</button>
      </form>
    </React.Fragment>
  );
};

const Questionaire = ({ currentQuiz, flashcardsById, dispatch }) => {
  const currentFlashcardId = currentQuiz.currentQuestion;
  const currentFlashcard = prop(currentFlashcardId, flashcardsById);
  const submittedAnswer = path(["answers", currentFlashcardId], currentQuiz);

  return (
    <div>
      <div className="flashcard mt-8 mx-auto p-8">
        <span className="flashcard__prompt">{currentFlashcard.prompt}</span>
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
    </div>
  );
};

const ErrorLine = (error) => {
  return (
    <li key={error.id}>
      {error.answer} => {error.solution}
    </li>
  );
};

const QuizReport = ({ currentQuiz, flashcardsById, dispatch }) => {
  const report = Quiz.report(currentQuiz, flashcardsById);
  console.log(report);
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
