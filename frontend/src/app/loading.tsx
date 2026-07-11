export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-paper">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pine border-t-transparent" />
        <p className="mt-4 font-medium text-ink">Loading...</p>
      </div>
    </div>
  )
}
