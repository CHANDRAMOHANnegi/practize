import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();

function jsResponse(source: string) {
  return new Response(source, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "application/javascript; charset=utf-8",
    },
  });
}

async function readNodeModuleFile(...parts: string[]) {
  return readFile(join(root, "node_modules", ...parts), "utf8");
}

function wrapReact(source: string) {
  return `
    (function () {
      var process = { env: { NODE_ENV: "development" } };
      var module = { exports: {} };
      var exports = module.exports;
      ${source}
      window.React = module.exports;
    })();
  `;
}

function wrapReactDom(scheduler: string, reactDom: string, reactDomClient: string) {
  return `
    (function () {
      var process = { env: { NODE_ENV: "development" } };

      var schedulerModule = { exports: {} };
      (function (module, exports) {
        ${scheduler}
      })(schedulerModule, schedulerModule.exports);

      var reactDomModule = { exports: {} };
      (function (module, exports) {
        var require = function (name) {
          if (name === "react") return window.React;
          throw new Error("Unsupported runtime dependency: " + name);
        };
        ${reactDom}
      })(reactDomModule, reactDomModule.exports);

      var clientModule = { exports: {} };
      (function (module, exports) {
        var require = function (name) {
          if (name === "scheduler") return schedulerModule.exports;
          if (name === "react") return window.React;
          if (name === "react-dom") return reactDomModule.exports;
          throw new Error("Unsupported runtime dependency: " + name);
        };
        ${reactDomClient}
      })(clientModule, clientModule.exports);

      window.ReactDOM = clientModule.exports;
    })();
  `;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ asset: string }> },
) {
  const { asset } = await context.params;

  if (asset === "react.js") {
    const react = await readNodeModuleFile("react", "cjs", "react.development.js");
    return jsResponse(wrapReact(react));
  }

  if (asset === "react-dom.js") {
    const [scheduler, reactDom, reactDomClient] = await Promise.all([
      readNodeModuleFile("scheduler", "cjs", "scheduler.development.js"),
      readNodeModuleFile("react-dom", "cjs", "react-dom.development.js"),
      readNodeModuleFile("react-dom", "cjs", "react-dom-client.development.js"),
    ]);
    return jsResponse(wrapReactDom(scheduler, reactDom, reactDomClient));
  }

  if (asset === "babel.js") {
    const babel = await readNodeModuleFile(
      "@babel",
      "standalone",
      "babel.min.js",
    );
    return jsResponse(babel);
  }

  return new Response("Not found", { status: 404 });
}
