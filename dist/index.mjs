// src/hooks/useErrorLogger.ts
import { useContext } from "react";

// src/components/ErrorReport/Provider/index.tsx
import { createContext, useCallback, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
var ErrorContext = createContext(void 0);

// src/hooks/useErrorLogger.ts
var useErrorLogger = () => {
  const context = useContext(ErrorContext);
  if (!context)
    throw new Error("useErrorLogger deve estar dentro de ErrorProvider");
  return context.reportError;
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

// src/components/ErrorReport/index.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
export {
  useErrorLogger
};
