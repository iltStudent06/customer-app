type Props = {
  loading: boolean
  error: string | null
  loadingMessage: string
}

function ApiStatus({ loading, error, loadingMessage }: Props) {
  if (loading) {
    return (
      <p className="api-status" aria-live="polite">
        {loadingMessage}
      </p>
    )
  }

  if (error) {
    return (
      <p className="api-status api-status-error" role="alert" aria-live="assertive">
        {error}
      </p>
    )
  }

  return null
}

export default ApiStatus