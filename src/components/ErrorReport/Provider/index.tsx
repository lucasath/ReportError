'use client';
import React, { createContext, useCallback, useEffect } from 'react';

export interface ErrorContextType {
    reportError: (error: Error) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode; endpoint: string; cb?: (error: Error) => VoidFunction }> = ({ children, endpoint, cb }) => {
    const reportError = useCallback(async (error: Error) => {
        try {
            if (cb) {
                cb(error);
            } else {
                await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: error.message,
                        stack: error.stack,
                        timestamp: new Date().toISOString(),
                    }),
                });
            }
        } catch (err) {
            console.error('[ErrorProvider] Falha ao reportar erro:', err);
        }
    }, [endpoint, cb]);

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            reportError(event.error || new Error(event.message));
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            reportError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, [reportError]);

    return (
        <ErrorContext.Provider value={{ reportError }}>
            {children}
        </ErrorContext.Provider>
    );
};