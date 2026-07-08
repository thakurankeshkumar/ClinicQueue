const tips = [
    "Securing your session",
    "Preparing your dashboard",
    "Syncing clinic data",
];

function FullScreenLoader({ title, subtitle }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
                <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/10 blur-3xl animate-pulse [animation-delay:200ms]" />
            </div>

            <div className="relative w-full max-w-md overflow-hidden rounded-4xl border border-white/15 bg-white/90 p-8 text-center shadow-[0_30px_120px_-48px_rgba(15,23,42,0.65)]">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(37,99,235,0.06),transparent_35%,rgba(13,148,136,0.06))]" />

                <div className="relative">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-white shadow-inner">
                        <div className="relative h-14 w-14">
                            <span className="absolute inset-0 rounded-full border-4 border-slate-200" />
                            <span className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin [animation-duration:1.25s]" />
                            <span className="absolute inset-2 rounded-full border-4 border-teal-500 border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.9s]" />
                            <span className="absolute inset-4 rounded-full bg-linear-to-br from-blue-500/10 to-teal-500/10 animate-pulse" />
                        </div>
                    </div>

                    <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>

                    <div className="mt-8 space-y-3">
                        {tips.map((tip, index) => (
                            <div
                                key={tip}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition duration-200 ease-out hover:bg-white hover:shadow-sm"
                                style={{ animationDelay: `${index * 180}ms` }}
                            >
                                <span>{tip}</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse [animation-delay:120ms]" />
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-2 w-full origin-left bg-linear-to-r from-blue-600 via-teal-500 to-blue-600 animate-[auth-progress_1.1s_ease-in-out_infinite]" />
                    </div>

                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                        Taking the waiting time out of the way
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FullScreenLoader;