import type { FrontendProblem } from "@/types/problem";
import metadata from "./frontend-problems-metadata.json";

type MetadataProblem = {
  index: number;
  slug: string;
  title: string;
  difficulty: FrontendProblem["difficulty"];
  companies: string[];
  tags: string[];
  estimatedMinutes: number;
};

function toSummary(problem: MetadataProblem) {
  return `Build a ${problem.title} that handles real interaction, state updates, and polished UI behavior.`;
}

function toRequirements(problem: MetadataProblem) {
  return [
    `Render the ${problem.title} clearly with accessible HTML.`,
    "Handle all required user interactions without page reloads.",
    "Keep component state predictable across re-renders.",
    "Cover empty, active, and completed UI states.",
    "Keep styling responsive for desktop and mobile screens.",
  ];
}

function starterCodeFor(problem: MetadataProblem) {
  if (problem.slug === "tag-input-component") {
    return `const { useState } = React;

function App() {
  const [tags, setTags] = useState(['Frontend', 'React']);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    // TODO: Add tag when Enter is pressed
    // Hint: Check e.key === 'Enter' and validate inputValue
  };

  const removeTag = (indexToRemove) => {
    // TODO: Remove the tag at the given index
    // Hint: Use filter to exclude the tag
  };

  return (
    <div className="container">
      <div className="tag-box">
        {tags.map((tag, index) => (
          <div key={index} className="tag">
            <span>{tag}</span>
            <button onClick={() => removeTag(index)} className="remove-btn">x</button>
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
}`;
  }

  return `const { useState } = React;

function App() {
  const [items, setItems] = useState(['First item', 'Second item']);

  return (
    <main className="demo-shell">
      <h1>${problem.title}</h1>
      <p>Build the interaction details for this component.</p>
      <button onClick={() => setItems([...items, 'New item'])}>Add item</button>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </main>
  );
}`;
}

function starterCssFor(problem: MetadataProblem) {
  if (problem.slug === "tag-input-component") {
    return `.container {
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
}`;
  }

  return `.demo-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  gap: 16px;
  padding: 32px;
  background: #f6f7fb;
  color: #1f2937;
}

button {
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: #f97316;
  cursor: pointer;
}`;
}

export const frontendProblems: FrontendProblem[] = (metadata as MetadataProblem[]).map(
  (problem) => ({
    ...problem,
    summary: toSummary(problem),
    requirements: toRequirements(problem),
    starterCode: starterCodeFor(problem),
    starterCss: starterCssFor(problem),
  }),
);

export function getFrontendProblem(slug: string) {
  return frontendProblems.find((problem) => problem.slug === slug);
}
