import { map, values } from "ramda";
import { isLoading, isSuccess } from "../events/remote";

const Flashcard = ({ id, prompt, solution }) => {
  return (
    <div key={id}>
      <span>{prompt}</span>
      <span>{solution}</span>
    </div>
  );
};

const Flashcards = ({ flashcards, status }) => {
  if (isLoading(status)) {
    return <span>Loading...</span>;
  } else if (isSuccess(status)) {
    return <ul>{map(Flashcard, values(flashcards))}</ul>;
  }

  return <div>Could not load Flashcards</div>;
};

export default Flashcards;
