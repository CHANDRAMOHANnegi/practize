import type { FrontendProblem } from "@/types/problem";
import metadata from "./frontend-problems-metadata.json";
import { frontendProblemOverrides } from "./problem-overrides";

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

function genericStarterCodeFor(problem: MetadataProblem) {
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

function genericStarterCssFor() {
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

function genericConstraints() {
  return [
    "Use React state and event handlers directly.",
    "Keep the UI responsive and keyboard-friendly.",
    "Do not rely on external component libraries.",
  ];
}

function genericSolutionNotes(problem: MetadataProblem) {
  return [
    `Identify the core state needed for ${problem.title}.`,
    "Render the base UI first, then wire one interaction at a time.",
    "Keep derived UI state computed from React state instead of duplicating it.",
  ];
}

function genericSolutionCodeFor(problem: MetadataProblem) {
  return `const { useState } = React;

function App() {
  const [items, setItems] = useState(['First item', 'Second item']);

  return (
    <main className="demo-shell">
      <h1>${problem.title}</h1>
      <p>Replace this sample with the complete interaction for this problem.</p>
      <button onClick={() => setItems([...items, \`Item \${items.length + 1}\`])}>
        Add item
      </button>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </main>
  );
}`;
}

function genericTestScript(problem: MetadataProblem) {
  return `
    const tests = [];
    const record = (name, passed, message) => tests.push({ name, passed, message });
    const root = document.querySelector('#root');
    record('Renders an application root', Boolean(root?.children.length), 'Expected React to render content.');
    record('Shows the problem title', Boolean(root?.textContent.includes(${JSON.stringify(problem.title)})), 'Expected the component to display the problem title.');
    record('Includes at least one interactive control', Boolean(document.querySelector('button, input, select, textarea')), 'Expected an interactive element.');
  `;
}

export const frontendProblems: FrontendProblem[] = (metadata as MetadataProblem[]).map(
  (problem) => {
    const override = frontendProblemOverrides[problem.slug];

    return {
      ...problem,
      summary: override?.summary ?? toSummary(problem),
      requirements: override?.requirements ?? toRequirements(problem),
      constraints: override?.constraints ?? genericConstraints(),
      solutionNotes: override?.solutionNotes ?? genericSolutionNotes(problem),
      solutionCode: override?.solutionCode || genericSolutionCodeFor(problem),
      solutionCss: override?.solutionCss || genericStarterCssFor(),
      starterCode: override?.starterCode ?? genericStarterCodeFor(problem),
      starterCss: override?.starterCss ?? genericStarterCssFor(),
      testScript: override?.testScript ?? genericTestScript(problem),
    };
  },
);

export function getFrontendProblem(slug: string) {
  return frontendProblems.find((problem) => problem.slug === slug);
}
