// Props for API request status display.
// - loading: indicates an in-flight request
// - error: contains an error message when a request fails
// - loadingMessage: customizable text shown while loading
type Props = {
  loading: boolean
  error: string | null
  loadingMessage: string
}

// Renders a status message for API activity.
// Priority order:
// 1) Loading message
// 2) Error message
// 3) Nothing when there is no status to show
function ApiStatus({ loading, error, loadingMessage }: Props) {
  // While data is loading, announce progress politely to assistive tech.
  if (loading) {
    return (
      <p className="api-status" aria-live="polite">
        {loadingMessage}
      </p>
    )
  }

  // If loading is finished and an error exists, announce it assertively.
  if (error) {
    return (
      <p className="api-status api-status-error" role="alert" aria-live="assertive">
        {error}
      </p>
    )
  }

  // No loading or error state: render nothing.
  return null
}

export default ApiStatus