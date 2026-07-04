"use client";

import dynamic from "next/dynamic";
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
import type { BeforeMount, OnMount } from "@monaco-editor/react";
import type { FrontendProblem } from "@/types/problem";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="editorLoading">Loading editor...</div>,
});

type CodingWorkspaceProps = {
  problem: FrontendProblem;
};

type WorkspaceFile = "app" | "css";
type ProblemPanel = "problem" | "solution" | "discuss" | "history";
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

const handleEditorBeforeMount: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("interview-studio-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955" },
      { token: "keyword", foreground: "C586C0" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "type.identifier", foreground: "4EC9B0" },
    ],
    colors: {
      "editor.background": "#202020",
      "editor.foreground": "#d7dce6",
      "editor.lineHighlightBackground": "#262626",
      "editorLineNumber.foreground": "#71717a",
      "editorLineNumber.activeForeground": "#d8dee9",
      "editor.selectionBackground": "#334155",
      "editorCursor.foreground": "#f97316",
      "editorGutter.background": "#202020",
      "scrollbarSlider.background": "#3f3f46",
      "scrollbarSlider.hoverBackground": "#52525b",
    },
  });
};

export function CodingWorkspace({ problem }: CodingWorkspaceProps) {
  const [appCode, setAppCode] = useState(problem.starterCode);
  const [cssCode, setCssCode] = useState(problem.starterCss);
  const [activeFile, setActiveFile] = useState<WorkspaceFile>("app");
  const [activePanel, setActivePanel] = useState<ProblemPanel>("problem");
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
          ${problem.testScript}

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
  const activeLanguage = activeFile === "app" ? "javascript" : "css";
  const passedCount = testResults.filter((test) => test.passed).length;
  const editorOptions = useMemo(
    () => ({
      automaticLayout: true,
      fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
      fontSize: 17,
      lineHeight: 28,
      minimap: { enabled: false },
      padding: { top: 24, bottom: 24 },
      renderLineHighlight: "line" as const,
      scrollBeyondLastLine: false,
      tabSize: 2,
      wordWrap: "on" as const,
    }),
    [],
  );

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, runEvaluation);
  };

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
          <button
            className={activePanel === "problem" ? "active" : ""}
            onClick={() => setActivePanel("problem")}
          >
            <Code2 size={16} />
            Problem
          </button>
          <button
            className={activePanel === "solution" ? "active" : ""}
            onClick={() => setActivePanel("solution")}
          >
            <Lightbulb size={16} />
            Solution
          </button>
          <button
            className={activePanel === "discuss" ? "active" : ""}
            onClick={() => setActivePanel("discuss")}
          >
            <MessageCircle size={16} />
            Discuss
          </button>
          <button
            className={activePanel === "history" ? "active" : ""}
            onClick={() => setActivePanel("history")}
          >
            <History size={16} />
            History
          </button>
        </div>

        <div className="problemScroll">
          {activePanel === "problem" && (
            <>
              <div className="popularBlock">
                <span>Popular At</span>
                <div>
                  {problem.companies.slice(0, 5).map((company) => (
                    <em key={company}>{company}</em>
                  ))}
                </div>
              </div>

              <h2>Description</h2>
              <p>{problem.summary}</p>

              <h2>Features</h2>
              <ul>
                {problem.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>

              <h2>Constraints</h2>
              <ul>
                {problem.constraints.map((constraint) => (
                  <li key={constraint}>{constraint}</li>
                ))}
              </ul>
            </>
          )}

          {activePanel === "solution" && (
            <>
              <h2>Solution Notes</h2>
              <ul>
                {problem.solutionNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </>
          )}

          {activePanel === "discuss" && (
            <div className="emptyPanel">
              <h2>Discuss</h2>
              <p>Discussion threads will land after auth and persistence are added.</p>
            </div>
          )}

          {activePanel === "history" && (
            <div className="emptyPanel">
              <h2>History</h2>
              <p>Submission history will track attempts once user accounts exist.</p>
            </div>
          )}
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

        <div className="monacoEditorShell">
          <MonacoEditor
          key={activeFile}
          beforeMount={handleEditorBeforeMount}
          defaultLanguage={activeLanguage}
          language={activeLanguage}
          onChange={(value) => {
            if (activeFile === "app") {
              setAppCode(value ?? "");
            } else {
              setCssCode(value ?? "");
            }
            setStatus("idle");
          }}
          onMount={handleEditorMount}
          options={editorOptions}
          path={`${problem.slug}-${activeFile}.${activeFile === "app" ? "jsx" : "css"}`}
          theme="interview-studio-dark"
          value={activeCode}
        />
        </div>
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
