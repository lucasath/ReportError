
# ErrorReport

A React library for global error capturing and automatic reporting to a configured endpoint.

---

## Table of Contents

- [Installation](#installation)  
- [Basic Usage](#basic-usage)  
- [Components](#components)  
- [Hook](#hook)  
- [Configuration](#configuration)  
- [Testing](#testing)  
- [Contributing](#contributing)  
- [License](#license)

---

## Installation

```bash
npm install errorreport
# or
yarn add errorreport
```

---

## Basic Usage

Wrap your app with the `ErrorProvider`, providing the endpoint to which errors will be sent.

```tsx
import { ErrorProvider, ErrorBoundary } from "errorreport";

export default function App() {
  return (
    <ErrorProvider endpoint="/api/error-report">
      <ErrorBoundary fallback={<div>An unexpected error occurred.</div>}>
        <YourApp />
      </ErrorBoundary>
    </ErrorProvider>
  );
}
```

---

## Components

### `<ErrorProvider>`

Provider that captures global JavaScript errors and unhandled promise rejections, sending them to the configured endpoint.

**Props:**

| Name     | Type     | Description                         |
|----------|----------|-----------------------------------|
| endpoint | `string` | URL where the error reports are sent |

---

### `<ErrorBoundary>`

Class component that catches render errors and calls `reportError` from context.

**Props:**

| Name     | Type             | Description                      |
|----------|------------------|--------------------------------|
| fallback | `React.ReactNode` | UI shown when an error occurs   |
| children | `React.ReactNode` | Child components to render      |

---

## Hook

### `useErrorReport()`

Hook to access the `reportError` function manually.

```tsx
import { useErrorReport } from "errorreport";

function Example() {
  const reportError = useErrorReport();

  const handleClick = () => {
    try {
      // code that may throw an error
    } catch (error) {
      reportError(error);
    }
  };

  return <button onClick={handleClick}>Test Error</button>;
}
```

---

## Configuration

- Wrap your entire app tree with `ErrorProvider` to capture global errors.  
- Wrap components you want to monitor with `ErrorBoundary`.  
- Captured errors are sent via `fetch` as a POST request with a JSON payload containing:  
  - `message`: error message  
  - `stack`: stack trace  
  - `timestamp`: ISO timestamp when the error was captured  

---

## Testing

- The library includes tests using Jest and React Testing Library.  
- To run tests:

```bash
npm run test
```

---

## Contributing

Pull requests and issues are welcome!  
Please follow the coding style and test your changes before submitting.

---

## License

MIT © Your Name