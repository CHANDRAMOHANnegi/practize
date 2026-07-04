"use client";

import { Clock, Code2, History, Lightbulb, MessageCircle, Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { FrontendProblem } from "@/types/problem";

type CodingWorkspaceProps = {
  problem: FrontendProblem;
};

export function CodingWorkspace({ problem }: CodingWorkspaceProps) {
  const [code, setCode] = useState(problem.starterCode);
  const [status, setStatus] = useState<"idle" | "running" | "passed">("idle");

  const previewHtml = useMemo(
    () => `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #f5f5f5; color: #252525; }
            main { min-height: 100vh; display: grid; place-items: center; padding: 28px; }
            .phone { width: 310px; min-height: 430px; border: 2px solid #dedede; border-radius: 10px; background: white; display: grid; place-items: center; padding: 22px; }
            .tag { display: inline-flex; align-items: center; gap: 8px; margin: 6px; padding: 8px 12px; border-radius: 999px; background: linear-gradient(90deg, #6b6fe8, #8756bf); color: white; font-size: 15px; }
            .x { width: 19px; height: 19px; border-radius: 999px; display: inline-grid; place-items: center; background: rgba(255,255,255,.25); }
            .placeholder { margin-top: 120px; color: #777; font-size: 17px; }
          </style>
        </head>
        <body>
          <main>
            <div class="phone">
              <div>
                <span class="tag">Frontend <span class="x">x</span></span>
                <span class="tag">React <span class="x">x</span></span>
                <div class="placeholder">Add a tag...</div>
              </div>
            </div>
          </main>
        </body>
      </html>
    `,
    [problem],
  );

  function runEvaluation() {
    setStatus("running");
    window.setTimeout(() => setStatus("passed"), 650);
  }

  return (
    <div className="workspaceShell">
      <header className="workspaceHeader">
        <div className="workspaceTitle">
          <span className="backButton">‹</span>
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
          <button className="workspaceIconButton">
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
          <div className="fileTab active">App.js</div>
          <div className="fileTab">styles.css</div>
          <div>
            <button onClick={() => setCode(problem.starterCode)}>
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
          value={code}
          onChange={(event) => setCode(event.target.value)}
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
          {status === "passed" && (
            <ul>
              <li>Component renders without crashing.</li>
              <li>Problem requirements are present.</li>
              <li>Ready for real tests in the next iteration.</li>
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
