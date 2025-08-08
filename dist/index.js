"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ErrorReport: () => ErrorReport_default,
  useErrorLogger: () => useErrorLogger
});
module.exports = __toCommonJS(src_exports);

// src/components/ErrorReport/Provider/index.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var ErrorContext = (0, import_react.createContext)(void 0);
var ErrorProvider = ({ children, endpoint, cb }) => {
  const reportError = (0, import_react.useCallback)(async (error) => {
    try {
      if (cb) {
        cb(error);
      } else {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          })
        });
      }
    } catch (err) {
      console.error("[ErrorProvider] Falha ao reportar erro:", err);
    }
  }, [endpoint, cb]);
  (0, import_react.useEffect)(() => {
    const handleError = (event) => {
      reportError(event.error || new Error(event.message));
    };
    const handleRejection = (event) => {
      reportError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    };
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [reportError]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorContext.Provider, { value: { reportError }, children });
};

// src/components/ErrorReport/Boundary/index.tsx
var import_react2 = __toESM(require("react"));
var ErrorBoundary = class extends import_react2.default.Component {
  static contextType = ErrorContext;
  state = {
    hasError: false
  };
  componentDidCatch(error) {
    this.setState({ hasError: true });
    const reportError = this.context?.reportError;
    if (reportError) {
      reportError(error);
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
};

// src/hooks/useErrorLogger.ts
var import_react3 = require("react");
var useErrorLogger = () => {
  const context = (0, import_react3.useContext)(ErrorContext);
  if (!context)
    throw new Error("useErrorLogger deve estar dentro de ErrorProvider");
  return context.reportError;
};

// src/components/ErrorReport/index.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ErrorReport = ({ endpoint, children, cb }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ErrorProvider, { endpoint, cb, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ErrorBoundary, { children }) });
};
var ErrorReport_default = ErrorReport;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorReport,
  useErrorLogger
});
