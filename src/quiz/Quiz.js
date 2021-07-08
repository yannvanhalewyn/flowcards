import { useState } from "react";
import React from "react";
import { nth, prop, path } from "ramda";

const ReportAnswer = ({ flashcard, answer, onNextQuestion }) => {
  if (flashcard.solution === answer) {
    return <div>Success!</div>;
  }
  return (
    <div>
      Failed! Expected {flashcard.solution} but you guessed {answer}
      <button onClick={onNextQuestion}>Next Question</button>
    </div>
  );
};

const CollectAnswer = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  return (
    <React.Fragment>
      <input
        className="flashcard__input mt-8"
        type="text"
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => onSubmit(input)}>Guess!</button>
    </React.Fragment>
  );
};

const Quiz = ({ currentQuiz, flashcardsById, dispatch }) => {
  const currentFlashcardId = currentQuiz.currentQuestion;
  const currentFlashcard = prop(currentFlashcardId, flashcardsById);
  const submittedAnswer = path(["answers", currentFlashcardId], currentQuiz);

  return (
    <div>
      <div className="flashcard mt-8 mx-auto p-8">
        <span className="flashcard__prompt">{currentFlashcard.prompt}</span>
        {submittedAnswer ? (
          <ReportAnswer
            flashcard={currentFlashcard}
            answer={submittedAnswer}
            onNextQuestion={() => dispatch({ type: "QUIZ/NEXT_QUESTION" })}
          />
        ) : (
          <CollectAnswer
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

export default Quiz;
