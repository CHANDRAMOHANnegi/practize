type CreatePreviewHtmlInput = {
  appCode: string;
  cssCode: string;
  runId: number;
  testScript: string;
};

function escapeInlineScript(value: string) {
  return value.replaceAll("</script", "<\\/script");
}

export function createPreviewHtml({
  appCode,
  cssCode,
  runId,
  testScript,
}: CreatePreviewHtmlInput) {
  const runnerSource = `
    ${appCode}

    if (typeof App !== 'function') {
      throw new Error('Expected App to be defined as a function component.');
    }

    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);

    async function runWorkspaceTests() {
      try {
        ${testScript}

        const passed = tests.every((test) => test.passed);
        parent.postMessage({
          source: 'interview-studio-preview',
          runId: window.__RUN_ID__,
          status: passed ? 'passed' : 'failed',
          tests
        }, '*');
      } catch (error) {
        parent.postMessage({
          source: 'interview-studio-preview',
          runId: window.__RUN_ID__,
          status: 'error',
          error: error instanceof Error ? error.message : String(error)
        }, '*');
      }
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
        <script src="/frontend-runner/react.js"></script>
        <script src="/frontend-runner/react-dom.js"></script>
        <script src="/frontend-runner/babel.js"></script>
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
}
