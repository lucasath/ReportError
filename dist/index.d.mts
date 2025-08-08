declare const useErrorLogger: () => (error: Error) => void;

interface ErrorContextType {
    reportError: (error: Error) => void;
}

export { type ErrorContextType, useErrorLogger };
