import type { FrontendProblem } from "@/types/problem";

export type FrontendProblemOverride = Pick<
  FrontendProblem,
  | "summary"
  | "requirements"
  | "constraints"
  | "solutionNotes"
  | "solutionCode"
  | "solutionCss"
  | "starterCode"
  | "starterCss"
  | "testScript"
>;

export const frontendProblemOverrides: Record<string, FrontendProblemOverride> = {
  "tag-input-component": {
    summary:
      "Build a tag input where users can add unique tags with Enter and remove existing tags with a close button.",
    requirements: [
      "Render the initial tags: Frontend and React.",
      "Allow typing into a text input with placeholder Add a tag...",
      "Add a trimmed tag when the user presses Enter.",
      "Reject empty or whitespace-only tags.",
      "Remove the clicked tag without mutating the existing array directly.",
    ],
    constraints: [
      "Use React state for tags and the current input value.",
      "Keep every rendered tag removable by button click.",
      "Do not use external component libraries.",
      "Keep the input usable after adding or removing tags.",
    ],
    solutionNotes: [
      "Keep two pieces of state: tags for the rendered list and inputValue for the controlled input.",
      "On Enter, trim inputValue before using it. This rejects empty and whitespace-only tags.",
      "Avoid duplicate tags by checking the normalized tag against the existing list before adding.",
      "Use a functional setTags update when adding so the new list is based on the latest state.",
      "Clear inputValue only after a successful add so the input stays controlled and ready for the next tag.",
      "Remove by index with filter. This creates a new array instead of mutating the existing state.",
      "Use a button with an aria-label for each remove action so screen readers announce which tag will be removed.",
    ],
    solutionCode: `const { useState } = React;

function App() {
  const [tags, setTags] = useState(['Frontend', 'React']);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    const nextTag = inputValue.trim();

    if (!nextTag) {
      return;
    }

    const alreadyExists = tags.some(
      (tag) => tag.toLowerCase() === nextTag.toLowerCase()
    );

    if (alreadyExists) {
      setInputValue('');
      return;
    }

    setTags((currentTags) => [...currentTags, nextTag]);
    setInputValue('');
  };

  const removeTag = (indexToRemove) => {
    setTags((currentTags) =>
      currentTags.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="container">
      <div className="tag-box">
        {tags.map((tag, index) => (
          <div key={tag} className="tag">
            <span>{tag}</span>
            <button
              aria-label={\`Remove \${tag}\`}
              onClick={() => removeTag(index)}
              className="remove-btn"
            >
              x
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
        />
      </div>
    </div>
  );
}`,
    solutionCss: `.container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background: #f6f7fb;
}

.tag-box {
  width: min(420px, 100%);
  min-height: 260px;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  padding: 22px;
  border: 2px solid #dedee5;
  border-radius: 14px;
  background: #fff;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(90deg, #6b6fe8, #8756bf);
}

.remove-btn {
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
}

input {
  min-width: 160px;
  flex: 1;
  border: 0;
  outline: 0;
  color: #172033;
  font-size: 16px;
}`,
    starterCode: `const { useState } = React;

function App() {
  const [tags, setTags] = useState(['Frontend', 'React']);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    // TODO: Add tag when Enter is pressed
    // Hint: trim inputValue, reject empty values, then clear the input
  };

  const removeTag = (indexToRemove) => {
    // TODO: Remove the tag at the given index
    // Hint: Use filter to exclude the tag
  };

  return (
    <div className="container">
      <div className="tag-box">
        {tags.map((tag, index) => (
          <div key={tag} className="tag">
            <span>{tag}</span>
            <button
              aria-label={\`Remove \${tag}\`}
              onClick={() => removeTag(index)}
              className="remove-btn"
            >
              x
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
        />
      </div>
    </div>
  );
}`,
    starterCss: `.container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background: #f6f7fb;
}

.tag-box {
  width: min(420px, 100%);
  min-height: 260px;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  padding: 22px;
  border: 2px solid #dedee5;
  border-radius: 14px;
  background: #fff;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(90deg, #6b6fe8, #8756bf);
}

.remove-btn {
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
}

input {
  min-width: 160px;
  flex: 1;
  border: 0;
  outline: 0;
  font-size: 16px;
}`,
    testScript: `
      const tests = [];
      const record = (name, passed, message) => tests.push({ name, passed, message });
      const root = document.querySelector('#root');
      const renderedText = () => root ? root.textContent : '';
      const input = document.querySelector('input[placeholder="Add a tag..."]');

      record('Renders the tag input field', Boolean(input), 'Expected an input with placeholder Add a tag...');
      record('Shows the initial Frontend tag', renderedText().includes('Frontend'), 'Expected the initial Frontend tag.');
      record('Shows the initial React tag', renderedText().includes('React'), 'Expected the initial React tag.');

      if (input) {
        const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        valueSetter.call(input, 'Vue');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 80));
        record('Adds a new tag when Enter is pressed', renderedText().includes('Vue'), 'Type a valid tag and add it on Enter.');
      }

      const removeButton = document.querySelector('.remove-btn');
      if (removeButton) {
        removeButton.click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        record('Removes a tag when close is clicked', !renderedText().includes('Frontend'), 'The clicked tag should be removed from state.');
      } else {
        record('Removes a tag when close is clicked', false, 'Expected a .remove-btn button.');
      }
    `,
  },

  "star-rating-component": {
    summary:
      "Build an interactive 5-star rating component where clicking a star selects that rating and updates the visible state.",
    requirements: [
      "Render exactly five star buttons.",
      "Let the user select a rating by clicking a star.",
      "Show the selected rating in text.",
      "Visually distinguish selected stars from unselected stars.",
      "Keep the component accessible with button labels.",
    ],
    constraints: [
      "Use a single number state value for the selected rating.",
      "Use buttons for stars so the interaction is keyboard reachable.",
      "Do not use image assets for the stars.",
      "Keep the component responsive inside the preview frame.",
    ],
    solutionNotes: [
      "Map over [1, 2, 3, 4, 5] to render buttons.",
      "Set selectedRating to the clicked star value.",
      "Use selectedRating >= star to decide selected styling.",
      "Render text such as Selected rating: 4.",
    ],
    solutionCode: "",
    solutionCss: "",
    starterCode: `const { useState } = React;

function App() {
  const [selectedRating, setSelectedRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  const handleRate = (rating) => {
    // TODO: Store the clicked rating in state
  };

  return (
    <main className="rating-card">
      <h1>Star Rating Component</h1>
      <div className="stars" aria-label="Choose a rating">
        {stars.map((star) => (
          <button
            key={star}
            aria-label={\`Rate \${star}\`}
            className={star <= selectedRating ? 'star selected' : 'star'}
            onClick={() => handleRate(star)}
          >
            ★
          </button>
        ))}
      </div>
      <p>Selected rating: {selectedRating}</p>
    </main>
  );
}`,
    starterCss: `.rating-card {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 18px;
  padding: 32px;
  color: #172033;
  background: #f8fafc;
  text-align: center;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.star {
  border: 0;
  color: #cbd5e1;
  background: transparent;
  font-size: 44px;
  line-height: 1;
  cursor: pointer;
}

.star.selected {
  color: #f59e0b;
}`,
    testScript: `
      const tests = [];
      const record = (name, passed, message) => tests.push({ name, passed, message });
      const root = document.querySelector('#root');
      const buttons = Array.from(document.querySelectorAll('button[aria-label^="Rate "]'));

      record('Renders exactly five star buttons', buttons.length === 5, 'Expected five buttons labelled Rate 1 through Rate 5.');
      record('Shows an initial zero rating', Boolean(root?.textContent.includes('Selected rating: 0')), 'Expected initial text Selected rating: 0.');

      const fourthStar = document.querySelector('button[aria-label="Rate 4"]');
      if (fourthStar) {
        fourthStar.click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        record('Updates text after selecting rating 4', Boolean(root?.textContent.includes('Selected rating: 4')), 'Clicking Rate 4 should update selectedRating.');
        record('Marks four stars as selected', document.querySelectorAll('.star.selected').length === 4, 'Four stars should have the selected class.');
      } else {
        record('Updates text after selecting rating 4', false, 'Expected a Rate 4 button.');
        record('Marks four stars as selected', false, 'Expected a Rate 4 button.');
      }
    `,
  },

  "accordion-component": {
    summary:
      "Build an accordion that renders FAQ rows and expands the selected answer while keeping the interaction predictable.",
    requirements: [
      "Render a list of FAQ questions.",
      "Open an answer when its question is clicked.",
      "Close the currently open answer when the same question is clicked again.",
      "Only one answer should be open at a time.",
      "Use semantic buttons for question controls.",
    ],
    constraints: [
      "Store the open row index in React state.",
      "Do not render every answer as visible at the same time.",
      "Use aria-expanded on each question button.",
      "Keep answer text in the DOM only when that item is open.",
    ],
    solutionNotes: [
      "Use one state value, activeIndex, because only one FAQ row can be open at a time.",
      "Initialize activeIndex to null so the accordion starts fully collapsed.",
      "In toggleItem, compare the clicked index with activeIndex. If they match, close the row by setting null.",
      "If the clicked row is different, set activeIndex to that index. This automatically closes the previously open row.",
      "Render each question as a button, not a div, so keyboard users can focus and activate it.",
      "Set aria-expanded from activeIndex === index so assistive tech can read the expanded state.",
      "Render the answer only for the active row. This keeps the DOM aligned with the visible UI and satisfies the requirement.",
    ],
    solutionCode: `const { useState } = React;

const faqs = [
  {
    question: 'What is React state?',
    answer: 'State is data that changes over time and causes the UI to re-render.'
  },
  {
    question: 'Why use keys in lists?',
    answer: 'Keys help React identify which items changed, moved, or were removed.'
  },
  {
    question: 'What is conditional rendering?',
    answer: 'Conditional rendering displays UI only when a condition is true.'
  }
];

function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex((currentIndex) => (
      currentIndex === index ? null : index
    ));
  };

  return (
    <main className="accordion-card">
      <h1>Accordion Component</h1>
      <section className="accordion" aria-label="React FAQ">
        {faqs.map((item, index) => {
          const isOpen = activeIndex === index;

          return (
            <article key={item.question} className="accordion-item">
              <button
                className="question"
                aria-expanded={isOpen}
                onClick={() => toggleItem(index)}
              >
                {item.question}
                <span aria-hidden="true">{isOpen ? '-' : '+'}</span>
              </button>
              {isOpen && (
                <p className="answer">{item.answer}</p>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}`,
    solutionCss: `.accordion-card {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 18px;
  padding: 32px;
  background: #f8fafc;
  color: #172033;
}

.accordion {
  width: min(560px, calc(100vw - 48px));
  border: 1px solid #d8dee8;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.accordion-item + .accordion-item {
  border-top: 1px solid #e5e7eb;
}

.question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 0;
  color: #172033;
  background: white;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.question:hover,
.question:focus-visible {
  background: #f8fafc;
}

.answer {
  margin: 0;
  padding: 0 20px 18px;
  color: #64748b;
  line-height: 1.6;
}`,
    starterCode: `const { useState } = React;

const faqs = [
  {
    question: 'What is React state?',
    answer: 'State is data that changes over time and causes the UI to re-render.'
  },
  {
    question: 'Why use keys in lists?',
    answer: 'Keys help React identify which items changed, moved, or were removed.'
  },
  {
    question: 'What is conditional rendering?',
    answer: 'Conditional rendering displays UI only when a condition is true.'
  }
];

function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    // TODO: Open the clicked item, or close it if already open
  };

  return (
    <main className="accordion-card">
      <h1>Accordion Component</h1>
      <section className="accordion">
        {faqs.map((item, index) => (
          <article key={item.question} className="accordion-item">
            <button
              className="question"
              aria-expanded={activeIndex === index}
              onClick={() => toggleItem(index)}
            >
              {item.question}
              <span>{activeIndex === index ? '-' : '+'}</span>
            </button>
            {activeIndex === index && (
              <p className="answer">{item.answer}</p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}`,
    starterCss: `.accordion-card {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 18px;
  padding: 32px;
  background: #f8fafc;
  color: #172033;
}

.accordion {
  width: min(560px, calc(100vw - 48px));
  border: 1px solid #d8dee8;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.accordion-item + .accordion-item {
  border-top: 1px solid #e5e7eb;
}

.question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 0;
  color: #172033;
  background: white;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.answer {
  margin: 0;
  padding: 0 20px 18px;
  color: #64748b;
  line-height: 1.6;
}`,
    testScript: `
      const tests = [];
      const record = (name, passed, message) => tests.push({ name, passed, message });
      const questions = Array.from(document.querySelectorAll('.question'));

      record('Renders three accordion questions', questions.length === 3, 'Expected three FAQ question buttons.');
      record('Starts with no answer visible', document.querySelectorAll('.answer').length === 0, 'Answers should be closed initially.');

      if (questions[0]) {
        questions[0].click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        record('Opens the clicked answer', document.querySelectorAll('.answer').length === 1, 'Clicking a question should show its answer.');
        record('Sets aria-expanded on the open question', questions[0].getAttribute('aria-expanded') === 'true', 'The open question should expose aria-expanded=true.');
      } else {
        record('Opens the clicked answer', false, 'Expected at least one question button.');
        record('Sets aria-expanded on the open question', false, 'Expected at least one question button.');
      }

      if (questions[0]) {
        questions[0].click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        record('Closes the same item on second click', document.querySelectorAll('.answer').length === 0, 'Clicking the open question again should close it.');
      } else {
        record('Closes the same item on second click', false, 'Expected at least one question button.');
      }
    `,
  },
};
