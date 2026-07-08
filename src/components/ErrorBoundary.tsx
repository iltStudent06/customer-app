import { Component, type ErrorInfo, type ReactNode } from 'react'

// Props accepted by the error boundary.
// It only needs to render the wrapped child tree.
interface ErrorBoundaryProps {
  children: ReactNode
}

// Internal state tracks whether an error occurred,
// plus captured error details for display/debugging.
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// Class-based error boundary for catching render-time errors
// in descendant components and showing a fallback UI.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initial healthy state before any rendering errors occur.
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  // React lifecycle method called when a descendant throws.
  // Marks boundary as failed so fallback UI is rendered.
  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  // React lifecycle method with detailed component stack info.
  // Stores extra diagnostics in state.
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })
  }

  // Resets boundary to healthy state, allowing re-render of children.
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  // Renders fallback UI when an error was captured; otherwise renders children.
  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="app-shell">
          <main className="app-main app-error-boundary" role="alert" aria-live="assertive">
            <h1>Something went wrong</h1>
            <p>
              We ran into an unexpected issue while rendering this page. You can try
              again.
            </p>
            <p className="app-error-message">
              Error details: {this.state.error?.message ?? 'Unknown error'}
            </p>
            {this.state.errorInfo?.componentStack ? (
              <pre className="app-error-stack">{this.state.errorInfo.componentStack}</pre>
            ) : null}
            <button
              type="button"
              className="form-button"
              onClick={this.handleReset}
            >
              Try Again
            </button>
          </main>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary