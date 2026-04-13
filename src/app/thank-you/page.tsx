export default function ThankYou() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#0a1628] text-white px-4 py-16 text-center">
      <div className="max-w-lg">
        <div className="w-16 h-16 rounded-full bg-[#b71c1c] flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-4">
          You&rsquo;re In.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          Your payment was successful. Check your email for login credentials
          and next steps to access the Real American Grit Scaling System.
        </p>
        <a
          href="/coaching"
          className="inline-flex h-12 items-center rounded-lg border border-gray-600 px-6 text-sm font-semibold text-gray-300 hover:border-gray-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </a>
      </div>
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#b71c1c]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#1a3a6b]" />
      </div>
    </div>
  );
}
