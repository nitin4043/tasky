interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
            {actionLabel ? (
                <button
                    onClick={onAction}
                    className="mt-4 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                    {actionLabel}
                </button>
            ) : null}
        </div>
    );
}
