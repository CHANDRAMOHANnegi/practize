"use client";

import dynamic from "next/dynamic";
import {
  Award,
  ChevronDown,
  CheckCircle2,
  Clock,
  Code2,
  History,
  Lightbulb,
  MessageCircle,
  Play,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { BeforeMount, OnMount } from "@monaco-editor/react";
import type { FrontendProblem } from "@/types/problem";
import { createPreviewHtml } from "@/features/frontend/runner/create-preview-html";
import type {
  PreviewMessage,
  TestResult,
} from "@/features/frontend/runner/types";
import {
  clearLocalSubmissions,
  deleteLocalSubmission,
  loadLocalSubmissions,
  saveLocalSubmission,
} from "@/features/frontend/submissions/local-submissions";
import type { LocalSubmissionAttempt } from "@/features/frontend/submissions/types";

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
  const [activeSolutionFile, setActiveSolutionFile] = useState<WorkspaceFile>("app");
  const [activePanel, setActivePanel] = useState<ProblemPanel>("problem");
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [runtimeError, setRuntimeError] = useState("");
  const [submissions, setSubmissions] = useState<LocalSubmissionAttempt[]>([]);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [submitNotice, setSubmitNotice] = useState("");
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);

  const previewHtml = useMemo(
    () =>
      createPreviewHtml({
        appCode,
        cssCode,
        runId,
        testScript: problem.testScript,
      }),
    [appCode, cssCode, problem, runId],
  );

  useEffect(() => {
    setSubmissions(loadLocalSubmissions(problem.slug));
  }, [problem.slug]);

  const persistSubmission = useCallback(
    (
      nextStatus: "passed" | "failed" | "error",
      nextTests: TestResult[],
      nextRuntimeError: string,
    ) => {
      const passedTests = nextTests.filter((test) => test.passed).length;
      const attempt: LocalSubmissionAttempt = {
        id: `${problem.slug}-${Date.now()}`,
        problemSlug: problem.slug,
        problemTitle: problem.title,
        submittedAt: new Date().toISOString(),
        status: nextStatus,
        passedCount: passedTests,
        totalCount: nextTests.length,
        appCode,
        cssCode,
        tests: nextTests,
        runtimeError: nextRuntimeError || undefined,
      };

      setSubmissions(saveLocalSubmission(attempt));
      setExpandedAttemptId(attempt.id);
      setSubmitNotice(
        nextStatus === "passed"
          ? "Submitted: all checks passed."
          : `Submitted: ${passedTests}/${nextTests.length} checks passed.`,
      );
      setActivePanel("history");
    },
    [appCode, cssCode, problem.slug, problem.title],
  );

  useEffect(() => {
    function handlePreviewMessage(event: MessageEvent<PreviewMessage>) {
      if (event.data?.source !== "interview-studio-preview") {
        return;
      }

      if (event.data.runId !== runId) {
        return;
      }

      const nextStatus = event.data.status;
      const nextTests = event.data.tests ?? [];
      const nextRuntimeError = event.data.error ?? "";

      setStatus(nextStatus);
      setTestResults(nextTests);
      setRuntimeError(nextRuntimeError);

      if (pendingSubmit) {
        persistSubmission(nextStatus, nextTests, nextRuntimeError);
        setPendingSubmit(false);
      }
    }

    window.addEventListener("message", handlePreviewMessage);
    return () => window.removeEventListener("message", handlePreviewMessage);
  }, [pendingSubmit, persistSubmission, runId]);

  function runEvaluation() {
    setStatus("running");
    setRuntimeError("");
    setTestResults([]);
    setSubmitNotice("");
    setRunId((currentRunId) => currentRunId + 1);
  }

  function submitAttempt() {
    setSubmitNotice("");

    if (status === "passed" || status === "failed" || status === "error") {
      persistSubmission(status, testResults, runtimeError);
      return;
    }

    setPendingSubmit(true);
    runEvaluation();
  }

  function resetWorkspace() {
    setAppCode(problem.starterCode);
    setCssCode(problem.starterCss);
    setActiveFile("app");
    setStatus("idle");
    setRuntimeError("");
    setTestResults([]);
    setPendingSubmit(false);
    setSubmitNotice("");
  }

  function restoreSubmission(attempt: LocalSubmissionAttempt) {
    setAppCode(attempt.appCode);
    setCssCode(attempt.cssCode);
    setActiveFile("app");
    setStatus("idle");
    setRuntimeError("");
    setTestResults([]);
    setSubmitNotice("Attempt restored into the editor.");
  }

  function deleteSubmission(attemptId: string) {
    const nextSubmissions = deleteLocalSubmission(problem.slug, attemptId);
    setSubmissions(nextSubmissions);
    setExpandedAttemptId((currentId) => (currentId === attemptId ? null : currentId));
    setSubmitNotice("Attempt deleted from local history.");
  }

  function clearHistory() {
    setSubmissions(clearLocalSubmissions(problem.slug));
    setExpandedAttemptId(null);
    setSubmitNotice("Local history cleared for this problem.");
  }

  const bestSubmissionId = useMemo(() => {
    if (submissions.length === 0) {
      return null;
    }

    return submissions.reduce((best, attempt) => {
      if (attempt.passedCount > best.passedCount) {
        return attempt;
      }

      if (
        attempt.passedCount === best.passedCount &&
        attempt.totalCount > best.totalCount
      ) {
        return attempt;
      }

      return best;
    }, submissions[0]).id;
  }, [submissions]);

  const latestSubmission = submissions[0];

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
  const solutionEditorOptions = useMemo(
    () => ({
      automaticLayout: true,
      domReadOnly: true,
      fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
      fontSize: 13,
      lineHeight: 22,
      minimap: { enabled: false },
      padding: { top: 14, bottom: 14 },
      readOnly: true,
      renderLineHighlight: "none" as const,
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
              {latestSubmission ? (
                <>
                  <span>•</span>
                  <span>
                    Latest {latestSubmission.passedCount}/{latestSubmission.totalCount}
                  </span>
                </>
              ) : null}
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
          <button className="submitButton" onClick={submitAttempt}>
            {pendingSubmit ? "Submitting..." : "Submit"}
          </button>
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
              <h2>Solution Files</h2>
              <div className="solutionFileTabs">
                <button
                  className={activeSolutionFile === "app" ? "active" : ""}
                  onClick={() => setActiveSolutionFile("app")}
                >
                  App.js
                </button>
                <button
                  className={activeSolutionFile === "css" ? "active" : ""}
                  onClick={() => setActiveSolutionFile("css")}
                >
                  styles.css
                </button>
              </div>
              <div className="solutionEditorShell">
                <MonacoEditor
                  beforeMount={handleEditorBeforeMount}
                  language={activeSolutionFile === "app" ? "javascript" : "css"}
                  options={solutionEditorOptions}
                  path={`${problem.slug}-solution-${activeSolutionFile}.${activeSolutionFile === "app" ? "jsx" : "css"}`}
                  theme="interview-studio-dark"
                  value={
                    activeSolutionFile === "app"
                      ? problem.solutionCode
                      : problem.solutionCss
                  }
                />
              </div>
            </>
          )}

          {activePanel === "discuss" && (
            <div className="emptyPanel">
              <h2>Discuss</h2>
              <p>Discussion threads will land after auth and persistence are added.</p>
            </div>
          )}

          {activePanel === "history" && (
            <div>
              <div className="historyHeader">
                <h2>History</h2>
                {submissions.length > 0 ? (
                  <button onClick={clearHistory}>
                    <Trash2 size={14} />
                    Clear
                  </button>
                ) : null}
              </div>
              {submitNotice ? <p className="submissionNotice">{submitNotice}</p> : null}
              {submissions.length === 0 ? (
                <p>No local attempts yet. Submit once to start tracking history.</p>
              ) : (
                <div className="submissionList">
                  {submissions.map((attempt) => {
                    const isExpanded = expandedAttemptId === attempt.id;
                    const isBest = bestSubmissionId === attempt.id;

                    return (
                      <article key={attempt.id} className="submissionItem">
                        <button
                          className="submissionSummary"
                          onClick={() =>
                            setExpandedAttemptId(isExpanded ? null : attempt.id)
                          }
                        >
                          <div>
                            <strong>
                              {attempt.passedCount}/{attempt.totalCount} checks
                            </strong>
                            <span>{new Date(attempt.submittedAt).toLocaleString()}</span>
                          </div>
                          <div className="submissionBadges">
                            {isBest ? (
                              <small className="bestAttemptBadge">
                                <Award size={12} />
                                Best
                              </small>
                            ) : null}
                            <small className={`submissionStatus ${attempt.status}`}>
                              {attempt.status}
                            </small>
                            <ChevronDown
                              className={isExpanded ? "expanded" : ""}
                              size={16}
                            />
                          </div>
                        </button>

                        {isExpanded ? (
                          <div className="submissionDetails">
                            {attempt.runtimeError ? (
                              <p className="submissionRuntimeError">
                                {attempt.runtimeError}
                              </p>
                            ) : null}
                            <ul>
                              {attempt.tests.map((test) => (
                                <li
                                  key={test.name}
                                  className={test.passed ? "passed" : "failed"}
                                >
                                  {test.passed ? (
                                    <CheckCircle2 size={15} />
                                  ) : (
                                    <XCircle size={15} />
                                  )}
                                  <span>
                                    {test.name}
                                    {!test.passed && test.message ? (
                                      <em>{test.message}</em>
                                    ) : null}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="submissionActions">
                              <button onClick={() => restoreSubmission(attempt)}>
                                Restore
                              </button>
                              <button
                                className="dangerAction"
                                onClick={() => deleteSubmission(attempt.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
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
