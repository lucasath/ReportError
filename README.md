
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
import { ErrorReport } from "errorreport";

export default function App() {
  // Using endpoint URL
  return (
    <ErrorReport endpoint="/api/error-report">
      <YourApp />
    </ErrorReport>
  );

  // Or using manual callback:
  /*
  return (
    <ErrorReport cb={(error) => {
      // handle error, e.g. send to custom logging service
      console.log("Custom error handler:", error);
    }}>
      <YourApp />
    </ErrorReport>
  );
  */
}

```

---

## Components

### `<ErrorReport>`

Provider that captures global JavaScript errors and unhandled promise rejections, sending them to the configured endpoint.

**Props:**

| Name     | Type     | Description                         |
|----------|----------|-----------------------------------|
| endpoint | `string` | URL where the error reports are sent |
| cb | `(error) => VoidFunction` | function callback to send to custom logging service |

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

- Wrap your entire app tree with `ErrorReport` to capture global errors.  
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

MIT © Lucas