import React from 'react';
import { ErrorProvider } from './Provider';
import { ErrorBoundary } from './Boundary';
export { useErrorLogger } from '../../hooks/useErrorLogger';
export type { ErrorContextType } from './Provider';

const ErrorReport = ({ endpoint, children, cb }: { endpoint: string, children: React.ReactNode, cb?: (error: Error) => VoidFunction }) => {
    return <ErrorProvider endpoint={endpoint} cb={cb}>
        <ErrorBoundary>{children}</ErrorBoundary>
    </ErrorProvider>
}

export default ErrorReport;