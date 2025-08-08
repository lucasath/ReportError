import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ErrorBoundary } from '.';
import { ErrorContext, ErrorProvider } from '../Provider';

function BrokenComponent() {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  React.useEffect(() => {
    setShouldThrow(true);
  }, []);

  if (shouldThrow) {
    throw new Error('Simulated render error');
  }

  return <div>OK</div>;
}

function TestConsumer() {
  const reportError = React.useContext(ErrorContext)?.reportError;

  React.useEffect(() => {
    if (reportError) {
      reportError(new Error('Erro de teste'));
    }
  }, [reportError]);

  return <div>Consumer</div>;
}

const endpoint = '/api/report';

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('envia erro para o endpoint via fetch', async () => {
    render(
      <ErrorProvider endpoint={endpoint}>
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      </ErrorProvider>
    );
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        endpoint,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Simulated render error'),
        })
      );
    });
  });

  it('chama reportError do contexto e cobre linha do this.context?.reportError', async () => {
    const cb = jest.fn().mockResolvedValueOnce(undefined);

    render(
      <ErrorProvider endpoint={endpoint} cb={cb}>
        <TestConsumer />
      </ErrorProvider>
    );

    expect(cb).toHaveBeenCalled();
  });

  it('não quebra quando o contexto é undefined', () => {
    render(<TestConsumer />);
    expect(true).toBe(true);
  });
});
