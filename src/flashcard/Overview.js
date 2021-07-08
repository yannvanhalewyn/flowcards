import { map } from "ramda";
import { isLoading, isSuccess } from "../events/remote";

const Flashcard = ({ id, prompt, solution }) => {
  return (
    <div key={id}>
      <span>{prompt}</span>
      <span>{solution}</span>
    </div>
  );
};

const Flashcards = ({ flashcards, status, dispatch }) => {
  if (isLoading(status)) {
    return <span>Loading...</span>;
  } else if (isSuccess(status)) {
    return (
      <div>
        <ul>{map(Flashcard, flashcards)}</ul>;
        <button
          onClick={() => dispatch({ type: "QUIZ/START", flashcards })}
        >
          Take a Quiz!
        </button>
      </div>
    );
  }

  return <div>Could not load Flashcards</div>;
};

export default Flashcards;
