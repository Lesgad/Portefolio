export default function LoadingSpinner() {
  return (
    <div
      className="rounded-full animate-pulse"
      style={{ width: '64px', height: '64px', backgroundColor: '#FDC435' }}
      role="status"
      aria-label="Chargement"
    />
  )
}
