/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, act } from '@testing-library/react';
import { ErrorProvider } from '.';
import { useErrorLogger } from '../../../hooks/useErrorLogger';

const endpoint = '/api/report';

beforeAll(() => {
  class MockPromiseRejectionEvent extends Event {
    reason: any;
    constructor(type: string, eventInitDict: { reason: any }) {
      super(type);
      this.reason = eventInitDict.reason;
    }
  }

  (global as any).PromiseRejectionEvent = MockPromiseRejectionEvent;
});

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  ) as jest.Mock;
  jest.spyOn(console, 'log').mockImplementation(() => { });
  jest.spyOn(console, 'warn').mockImplementation(() => { });
  jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
  jest.clearAllMocks();
  ['log', 'warn', 'error'].forEach(method => {
    const consoleMethod = console[method as keyof typeof console];
    if (jest.isMockFunction(consoleMethod)) {
      (consoleMethod as jest.Mock).mockRestore();
    }
  });
});

const TestComponent = () => {
  const reportError = useErrorLogger();

  React.useEffect(() => {
    reportError(new Error('Erro de teste'));
  }, [reportError]);

  return <div>Test</div>;
};
describe('ErrorProvider', () => {

  it('envia erro para o endpoint via reportError', async () => {
    await act(async () => {
      render(
        <ErrorProvider endpoint={endpoint}>
          <TestComponent />
        </ErrorProvider>
      );
    });

    expect(global.fetch).toHaveBeenCalledWith(endpoint, expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  it('adiciona e remove listeners de erro e rejeição', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <ErrorProvider endpoint={endpoint}>
        <div>Child</div>
      </ErrorProvider>
    );

    expect(addSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
  });

  it('reporta erro capturado pelo window.onerror', () => {
    render(
      <ErrorProvider endpoint={endpoint}>
        <div>Child</div>
      </ErrorProvider>
    );

    const event = new ErrorEvent('error', { message: 'Erro global', error: new Error('Erro global') });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(global.fetch).toHaveBeenCalled();
  });

  it('envia erro global via unhandledrejection', async () => {
    await act(async () => {
      render(
        <ErrorProvider endpoint={endpoint}>
          <div>Test</div>
        </ErrorProvider>
      );
    });

    const error = new Error('Erro de promessa');

    // simula evento unhandledrejection manualmente
    const event = new CustomEvent('unhandledrejection', {
      detail: error, // não será usado
    }) as unknown as PromiseRejectionEvent;

    Object.defineProperty(event, 'reason', {
      get: () => error,
    });

    window.dispatchEvent(event);

    await act(async () => { });

    expect(fetch).toHaveBeenCalledWith(endpoint, expect.objectContaining({
      method: 'POST',
    }));

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.message).toBe('Erro de promessa');
  });

  it('chama console.error quando fetch falha ao reportar erro via hook', async () => {
    // Mock do fetch que rejeita a promise para simular erro
    global.fetch = jest.fn(() => Promise.reject(new Error('Falha no fetch'))) as jest.Mock;

    await act(async () => {
      render(
        <ErrorProvider endpoint={endpoint}>
          <TestComponent />
        </ErrorProvider>
      );
    });

    expect(console.error).toHaveBeenCalledWith(
      '[ErrorProvider] Falha ao reportar erro:',
      expect.any(Error)
    );
  });

  it('loga erro no console.error quando fetch falha', async () => {
    const fakeError = new Error('Falha no fetch');

    global.fetch = jest.fn(() => Promise.reject(fakeError)) as jest.Mock;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    const TestComponent = () => {
      const reportError = useErrorLogger();

      React.useEffect(() => {
        reportError(new Error('Erro de teste'));
      }, [reportError]);

      return <div>Test</div>;
    };

    await act(async () => {
      render(
        <ErrorProvider endpoint={endpoint}>
          <TestComponent />
        </ErrorProvider>
      );
    });

    // Aguarda próximo ciclo para o catch ser executado
    await new Promise(r => setTimeout(r, 0));

    expect(consoleSpy).toHaveBeenCalledWith('[ErrorProvider] Falha ao reportar erro:', fakeError);

    consoleSpy.mockRestore();
  });

  it('reporta erro usando event.error se existir', () => {
    render(
      <ErrorProvider endpoint={endpoint}>
        <div>Test</div>
      </ErrorProvider>
    );

    const error = new Error('Erro com event.error');

    act(() => {
      window.dispatchEvent(new ErrorEvent('error', { error, message: 'irrelevante' }));
    });

    expect(fetch).toHaveBeenCalledWith(endpoint, expect.objectContaining({
      method: 'POST',
    }));

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.message).toBe('Erro com event.error');
  });

  it('reporta erro quando event.reason é Error', () => {
    render(
      <ErrorProvider endpoint={endpoint}>
        <div>Test</div>
      </ErrorProvider>
    );

    const error = new Error('Erro objeto');

    const event = new CustomEvent('unhandledrejection') as unknown as PromiseRejectionEvent;
    Object.defineProperty(event, 'reason', { get: () => error });

    act(() => window.dispatchEvent(event));

    expect(fetch).toHaveBeenCalled();

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.message).toBe('Erro objeto');
  });

  it('reporta erro criando new Error quando event.reason não é Error', () => {
    render(
      <ErrorProvider endpoint={endpoint}>
        <div>Test</div>
      </ErrorProvider>
    );

    const reasonString = 'Erro string';

    const event = new CustomEvent('unhandledrejection') as unknown as PromiseRejectionEvent;
    Object.defineProperty(event, 'reason', { get: () => reasonString });

    act(() => window.dispatchEvent(event));

    expect(fetch).toHaveBeenCalled();

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.message).toBe(reasonString);
  });

  it('reporta erro criando new Error com event.message se event.error for undefined', () => {
    render(
      <ErrorProvider endpoint={endpoint}>
        <div>Test</div>
      </ErrorProvider>
    );

    const message = 'Erro sem event.error';

    act(() => {
      window.dispatchEvent(new ErrorEvent('error', { message })); // event.error undefined
    });

    expect(fetch).toHaveBeenCalledWith(endpoint, expect.objectContaining({
      method: 'POST',
    }));

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.message).toBe(message);
  });

  it('lança erro se usar useErrorLogger fora do Provider', () => {
    const BrokenHook = () => {
      useErrorLogger();
      return null;
    };

    expect(() => render(<BrokenHook />)).toThrow(
      'useErrorLogger deve estar dentro de ErrorProvider'
    );
  });

  it('reporta erro usando uma função de callback', async () => {
    const cb = jest.fn().mockResolvedValueOnce(undefined);
    await act(async () => {
      render(
        <ErrorProvider endpoint={endpoint} cb={cb}>
          <TestComponent />
        </ErrorProvider>
      );
    });

    expect(cb).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});