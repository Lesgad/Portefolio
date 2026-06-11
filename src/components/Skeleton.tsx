import LoadingSpinner from './LoadingSpinner'

export default function Skeleton() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <LoadingSpinner />
    </div>
  )
}
