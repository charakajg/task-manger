import * as React from 'react';

interface ErrorBoundaryProps {
  fallback: React.ReactNode; // This represents the fallback UI to render when an error occurs
  children: React.ReactNode; // This represents the child components that the boundary wraps
}

interface ErrorBoundaryState {
  hasError: boolean; // State to track whether an error occurred
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Error Boundary Caught an Error:', error);
    console.error(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Return the fallback UI if an error has occurred
      return <>{this.props.fallback}</>;
    }

    // Render the child components if no error occurred
    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;
