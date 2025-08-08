import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

declare const useErrorLogger: () => (error: Error) => void;

declare const ErrorReport: ({ endpoint, children, cb }: {
    endpoint: string;
    children: React.ReactNode;
    cb?: (error: Error) => VoidFunction;
}) => react_jsx_runtime.JSX.Element;

export { ErrorReport, useErrorLogger };
