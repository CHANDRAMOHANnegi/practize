"use client";

import {
  CheckCircle2,
  Clock,
  Code2,
  History,
  Lightbulb,
  MessageCircle,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FrontendProblem } from "@/types/problem";

type CodingWorkspaceProps = {
  problem: FrontendProblem;
};

type WorkspaceFile = "app" | "css";
type RunStatus = "idle" | "running" | "passed" | "failed" | "error";
type TestResult = {
  name: string;
  passed: boolean;
  message?: string;
};

type PreviewMessage = {
  source: "interview-studio-preview";
  runId: number;
  status: "passed" | "failed" | "error";
  tests?: TestResult[];
  error?: string;
};

function escapeInlineScript(value: string) {
  return value.replaceAll("</script", "<\\/script");
}

function tagInputTestsScript() {
  return `
    const tests = [];
    const record = (name, passed, message) => tests.push({ name, passed, message });
    const root = document.querySelector('#root');
    const renderedText = () => root ? root.textContent : '';
    const input = document.querySelector('input[placeholder="Add a tag..."]');
    record('Renders the tag input field', Boolean(input), 'Expected an input with placeholder "Add a tag...".');
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
  `;
}

function genericTestsScript(problemTitle: string) {
  return `
    const tests = [];
    const record = (name, passed, message) => tests.push({ name, passed, message });
    record('Renders an application root', Boolean(document.querySelector('#root')?.children.length), 'Expected React to render content.');
    record('Shows the problem title', document.querySelector('#root')?.textContent.includes(${JSON.stringify(problemTitle)}), 'Expected the component to display the problem title.');
    record('Includes at least one interactive control', Boolean(document.querySelector('button, input, select, textarea')), 'Expected an interactive element.');
  `;
}

function testsScriptFor(problem: FrontendProblem) {
  return problem.slug === "tag-input-component"
    ? tagInputTestsScript()
    : genericTestsScript(problem.title);
}

export function CodingWorkspace({ problem }: CodingWorkspaceProps) {
  const [appCode, setAppCode] = useState(problem.starterCode);
  const [cssCode, setCssCode] = useState(problem.starterCss);
  const [activeFile, setActiveFile] = useState<WorkspaceFile>("app");
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [runtimeError, setRuntimeError] = useState("");

  const previewHtml = useMemo(
    () => {
      const runnerSource = `
        ${appCode}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);

        async function runWorkspaceTests() {
          ${testsScriptFor(problem)}

          const passed = tests.every((test) => test.passed);
          parent.postMessage({
            source: 'interview-studio-preview',
            runId: window.__RUN_ID__,
            status: passed ? 'passed' : 'failed',
            tests
          }, '*');
        }

        if (window.__RUN_ID__ > 0) {
          setTimeout(runWorkspaceTests, 120);
        }
      `;

      return `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #f6f7fb; }
            #root:empty::before {
              content: "Preview loading...";
              min-height: 100vh;
              display: grid;
              place-items: center;
              color: #697386;
            }
            ${cssCode}
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script>
            window.__RUN_ID__ = ${runId};
            window.onerror = function(message) {
              parent.postMessage({
                source: 'interview-studio-preview',
                runId: window.__RUN_ID__,
                status: 'error',
                error: String(message)
              }, '*');
            };
          </script>
          <script>
            try {
              const workspaceSource = ${JSON.stringify(escapeInlineScript(runnerSource))};
              const compiled = Babel.transform(workspaceSource, {
                presets: [['react', { runtime: 'classic' }]]
              }).code;
              new Function(compiled)();
            } catch (error) {
              parent.postMessage({
                source: 'interview-studio-preview',
                runId: window.__RUN_ID__,
                status: 'error',
                error: error instanceof Error ? error.message : String(error)
              }, '*');
            }
          </script>
        </body>
      </html>
    `;
    },
    [appCode, cssCode, problem, runId],
  );

  useEffect(() => {
    function handlePreviewMessage(event: MessageEvent<PreviewMessage>) {
      if (event.data?.source !== "interview-studio-preview") {
        return;
      }

      if (event.data.runId !== runId) {
        return;
      }

      setStatus(event.data.status);
      setTestResults(event.data.tests ?? []);
      setRuntimeError(event.data.error ?? "");
    }

    window.addEventListener("message", handlePreviewMessage);
    return () => window.removeEventListener("message", handlePreviewMessage);
  }, [runId]);

  function runEvaluation() {
    setStatus("running");
    setRuntimeError("");
    setTestResults([]);
    setRunId((currentRunId) => currentRunId + 1);
  }

  function resetWorkspace() {
    setAppCode(problem.starterCode);
    setCssCode(problem.starterCss);
    setActiveFile("app");
    setStatus("idle");
    setRuntimeError("");
    setTestResults([]);
  }

  const activeCode = activeFile === "app" ? appCode : cssCode;
  const passedCount = testResults.filter((test) => test.passed).length;

  return (
    <div className="workspaceShell">
      <header className="workspaceHeader">
        <div className="workspaceTitle">
          <span className="backButton">&lt;</span>
          <div>
            <h1>{problem.title}</h1>
            <div>
              <span className="workspaceDifficulty">{problem.difficulty}</span>
              <span>•</span>
              <Clock size={14} />
              <span>{problem.estimatedMinutes} mins</span>
            </div>
          </div>
        </div>
        <div className="workspaceActions">
          <span className="autoSave">
            <Code2 size={18} />
            Auto-Save Enabled
          </span>
          <button className="workspaceIconButton" onClick={resetWorkspace}>
            <RotateCcw size={18} />
          </button>
          <button className="runCode" onClick={runEvaluation}>
            <Play size={17} />
            Run Code
          </button>
          <button className="submitButton">Submit</button>
        </div>
      </header>

      <aside className="workspaceProblem">
        <div className="problemTabs">
          <button className="active">
            <Code2 size={16} />
            Problem
          </button>
          <button>
            <Lightbulb size={16} />
            Solution
          </button>
          <button>
            <MessageCircle size={16} />
            Discuss
          </button>
          <button>
            <History size={16} />
            History
          </button>
        </div>

        <div className="problemScroll">
          <div className="popularBlock">
            <span>Popular At</span>
            <div>
              {problem.companies.slice(0, 5).map((company) => (
                <em key={company}>{company}</em>
              ))}
            </div>
          </div>

          <h2>Description</h2>
          <p>
            Build a <strong>{problem.title}</strong> that allows users to complete
            the core interaction cleanly. The implementation should feel stable,
            accessible, and close to production quality.
          </p>

          <h2>Features</h2>
          <ul>
            {problem.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>

          <h2>Constraints</h2>
          <ul>
            <li>Use React state and event handlers directly.</li>
            <li>Keep the UI responsive and keyboard-friendly.</li>
            <li>Do not rely on external component libraries.</li>
          </ul>
        </div>
      </aside>

      <main className="editorPane">
        <header className="workspaceToolbar">
          <button
            className={`fileTab ${activeFile === "app" ? "active" : ""}`}
            onClick={() => setActiveFile("app")}
          >
            App.js
          </button>
          <button
            className={`fileTab ${activeFile === "css" ? "active" : ""}`}
            onClick={() => setActiveFile("css")}
          >
            styles.css
          </button>
          <div>
            <button onClick={resetWorkspace}>
              <RotateCcw size={16} />
              Reset
            </button>
            <button className="primaryAction compactRun" onClick={runEvaluation}>
              <Play size={16} />
              Run
            </button>
          </div>
        </header>

        <textarea
          className="codeEditor"
          value={activeCode}
          onChange={(event) => {
            if (activeFile === "app") {
              setAppCode(event.target.value);
            } else {
              setCssCode(event.target.value);
            }
            setStatus("idle");
          }}
          spellCheck={false}
        />
      </main>

      <aside className="previewPane">
        <header>
          <strong>Preview</strong>
          <span>Desktop</span>
        </header>
        <iframe title="Live preview" srcDoc={previewHtml} />
        <div className="testPanel">
          <strong>Terminal / Console</strong>
          {status === "idle" && <p>Run your solution to see local checks.</p>}
          {status === "running" && <p>Checking interactions and state updates...</p>}
          {status === "error" && <p className="errorText">{runtimeError}</p>}
          {(status === "passed" || status === "failed") && (
            <>
              <p className={status === "passed" ? "passText" : "failText"}>
                {passedCount}/{testResults.length} checks passed
              </p>
              <ul className="testResults">
                {testResults.map((test) => (
                  <li key={test.name} className={test.passed ? "passed" : "failed"}>
                    {test.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    <span>
                      {test.name}
                      {!test.passed && test.message ? <em>{test.message}</em> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
