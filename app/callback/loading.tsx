export default function CallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Finalizing Setup</h2>
          <p className="text-gray-500 dark:text-zinc-500 text-sm font-medium">Verifying your account credentials...</p>
        </div>
      </div>
    </div>
  )
}