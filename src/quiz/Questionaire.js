import { useState } from "react";
import Icon from "@mdi/react";
import { mdiCloseThick, mdiCheckBold } from "@mdi/js";
import { prop, path, map, contains } from "ramda";

import * as Quiz from "./model";
import * as QuizEvents from "./events";
import * as Flashcard from "../flashcard/model";

/*
 * The progress dots above the current question representing progression through
 * the quiz
 */
const Progress = ({ quiz, flashcardsById }) => {
  const report = Quiz.report(quiz, flashcardsById);

  const Segment = (questionId) => {
    let color;

    // No recorded answer
    if (!path(["answers", questionId], quiz)) {
      color = "bg-gray-200";
      // Answer was wrong!
    } else if (contains(questionId, map(prop("id"), report.errors))) {
      color = "bg-red-500";
      // Answer was correct
    } else {
      color = "bg-green-500";
    }

    return (
      <span
        key={questionId}
        className={`inline-block w-4 h-4 mr-3 rounded-full ${color}`}
      ></span>
    );
  };

  return <div className="">{map(Segment, quiz.questions)}</div>;
};

/*
 * Renders wether the answer was correct and the solution if not.
 */
const AnswerAndSolution = ({ flashcard, answer }) => {
  const InlineIcon = ({ path, className }) => (
    <Icon
      className={`inline-block -mt-1 mr-2 w-5 h-5 ${className}`}
      path={path}
    />
  );

  if (Flashcard.isCorrect(flashcard, answer)) {
    return (
      <p>
        <InlineIcon className="text-green-500" path={mdiCheckBold} />
        <span className="font-bold text-green-500">Correct!</span>
      </p>
    );
  }

  return (
    <>
      <p className="text-gray-700">
        <InlineIcon className="text-green-500" path={mdiCheckBold} />
        The correct answer was{" "}
        <span className="font-bold text-green-500"> {flashcard.solution} </span>
      </p>

      <p className="mt-2">
        <InlineIcon path={mdiCloseThick} className="text-red-500" />
        You replied <span className="font-bold text-red-500">{answer}</span>
      </p>
    </>
  );
};

/*
 * The page you see after submitting an answer to a questoin.
 */
const QuestionReport = ({
  quiz,
  flashcard,
  answer,
  onNextQuestion,
  onFinishQuiz,
}) => {
  const nextQuestion = Quiz.getNextQuestion(quiz);

  return (
    <div className="mt-4">
      <AnswerAndSolution flashcard={flashcard} answer={answer} />
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

/*
 * The form collecting user input to respond to a question.
 */
const QuestionInput = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  return (
    <>
      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (input) onSubmit(input);
        }}
      >
        <input
          className="border-b-2 w-full outline-none border-gray-200"
          type="text"
          focus={true}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </>
  );
};

/*
 * The entire questionaire flow component.
 */
const Questionaire = ({ currentQuiz, flashcardsById, dispatch }) => {
  const currentFlashcardId = currentQuiz.currentQuestion;
  const currentFlashcard = prop(currentFlashcardId, flashcardsById);
  const submittedAnswer = path(["answers", currentFlashcardId], currentQuiz);

  return (
    <div className="mt-8 p-8 bg-white rounded animation-appear">
      <Progress quiz={currentQuiz} flashcardsById={flashcardsById} />
      <h2 className="inline-block mt-8 font-bold text-xl border-l-4 pl-4 border-yellow-300">
        {currentFlashcard.prompt}
      </h2>
      {submittedAnswer ? (
        <QuestionReport
          quiz={currentQuiz}
          flashcard={currentFlashcard}
          answer={submittedAnswer}
          onNextQuestion={() => dispatch(QuizEvents.nextQuestion())}
          onFinishQuiz={() => dispatch(QuizEvents.finish())}
        />
      ) : (
        <QuestionInput
          onSubmit={(answer) =>
            dispatch(QuizEvents.answerQuestion(currentFlashcardId, answer))
          }
        />
      )}
    </div>
  );
};

export default Questionaire;
export { AnswerAndSolution };
