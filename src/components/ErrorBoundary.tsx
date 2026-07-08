import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

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