'use client';
import React from 'react';
import { ErrorContext } from '../Provider';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  static contextType = ErrorContext;
  declare context: React.ContextType<typeof ErrorContext>;

  state: State = {
    hasError: false,
  };

  componentDidCatch(error: Error) {
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
}
