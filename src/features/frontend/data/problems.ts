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

export const frontendProblems: FrontendProblem[] = (metadata as MetadataProblem[]).map(
  (problem) => ({
    ...problem,
    summary: toSummary(problem),
    requirements: toRequirements(problem),
    starterCode: starterCodeFor(problem),
  }),
);

export function getFrontendProblem(slug: string) {
  return frontendProblems.find((problem) => problem.slug === slug);
}
