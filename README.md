# react-agent-handler-link

A React hook wrapper for [Agent Handler Link](https://github.com/merge-api/agent-handler-link).

## Overview

This package provides a simple React hook to integrate the Agent Handler Link widget into your React application. It handles script loading, initialization, and provides a clean React API.

For detailed information about the Agent Handler Link widget architecture and how this package works, please refer to the [agent-handler-link README](https://github.com/merge-api/agent-handler-link).

## Installation

```bash
npm install @mergeapi/react-agent-handler-link
```

or

```bash
yarn add @mergeapi/react-agent-handler-link
```

## Usage

### Basic Example

```tsx
import { useAgentHandlerLink } from '@mergeapi/react-agent-handler-link';

function App() {
  const { open, isReady } = useAgentHandlerLink({
    linkToken: 'your-link-token',
    onSuccess: (publicToken) => {
      console.log('Successfully linked!', publicToken);
    },
    onExit: () => {
      console.log('User exited');
    },
  });

  return (
    <button onClick={open} disabled={!isReady}>
      {isReady ? 'Connect Integration' : 'Loading...'}
    </button>
  );
}
```

### API Reference

#### `useAgentHandlerLink(config)`

**Parameters:**
- `linkToken` (string, optional): The link token for authentication
- `tenantConfig` (object, optional): Custom tenant configuration
  - `apiBaseURL` (string): Custom API base URL
- `enable_telemetry` (boolean, optional): Enable/disable telemetry
- `onSuccess` (function): Callback when link is successful
- `onValidationError` (function, optional): Callback for validation errors
- `onExit` (function, optional): Callback when user exits
- `parentContainerID` (string, optional): ID of parent container element

**Returns:**
- `open` (function): Function to open the link widget
- `isReady` (boolean): Whether the widget is ready to be opened
- `error` (ErrorEvent | null): Any error that occurred during initialization

## How It Works

This package dynamically loads the Agent Handler Link widget from the CDN and provides a React-friendly interface. The widget runs in an iframe and exposes a `window.AgentHandlerLink` API that this hook wraps.

For more details on the architecture and the underlying widget, see the [agent-handler-link repository](https://github.com/merge-api/agent-handler-link).

## Related Repositories

- **[agent-handler-link](https://github.com/merge-api/agent-handler-link)**: The main Link widget application (this package wraps it)

## License

MIT
