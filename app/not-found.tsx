import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-lorenzo-dark text-lorenzo-text-light flex items-center justify-center px-6 md:px-12">
      <div className="w-full max-w-3xl text-center">
        <div className="flex items-center justify-center mb-8">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            className="text-lorenzo-accent"
            aria-hidden="true"
          >
            <path
              d="M9 4h6l1 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1-2Zm3 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none">
          <span className="text-lorenzo-accent">404</span>
        </div>

        <h1 className="mt-6 text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight">
          Frame Not Found
        </h1>

        <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
          The page youre looking for doesnt exist (or it was moved). Head back home and keep exploring Rahuls photography work.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-[14px] bg-lorenzo-accent text-lorenzo-dark font-black uppercase px-8 py-4 text-sm tracking-wider hover:bg-white transition-colors"
          >
            Back to Home
          </Link>
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-[14px] border border-white/20 text-white font-black uppercase px-8 py-4 text-sm tracking-wider hover:border-white/40 hover:text-white transition-colors"
          >
            Photography Enquiries
          </a>
        </div>
      </div>
    </main>
  )
}
