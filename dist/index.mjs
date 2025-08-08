// src/components/ErrorReport/Provider/index.tsx
import { createContext, useCallback, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
var ErrorContext = createContext(void 0);
var ErrorProvider = ({ children, endpoint, cb }) => {
  const reportError = useCallback(async (error) => {
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
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(ErrorContext.Provider, { value: { reportError }, children });
};

// src/components/ErrorReport/Boundary/index.tsx
import React2 from "react";
var ErrorBoundary = class extends React2.Component {
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
import { useContext } from "react";
var useErrorLogger = () => {
  const context = useContext(ErrorContext);
  if (!context)
    throw new Error("useErrorLogger deve estar dentro de ErrorProvider");
  return context.reportError;
};

// src/components/ErrorReport/index.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var ErrorReport = ({ endpoint, children, cb }) => {
  return /* @__PURE__ */ jsx2(ErrorProvider, { endpoint, cb, children: /* @__PURE__ */ jsx2(ErrorBoundary, { children }) });
};
var ErrorReport_default = ErrorReport;
export {
  ErrorReport_default as ErrorReport,
  useErrorLogger
};
