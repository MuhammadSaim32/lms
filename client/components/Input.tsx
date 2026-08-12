export default function Input({labelclassName, htmtFor, labelText, className, ...props }) {
    return (
        <div className="w-full">
            <label htmlFor={htmtFor} 
            className={`font-semibold text-sm text-slate-300 block mb-1.5 ${labelclassName}`}
            >{labelText}</label>

            <input
                className={`w-full bg-slate-900/50 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-3 text-sm text-white outline-none transition-all ${className}`}
                {...props}
            />
            {props.error &&
                <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium animate-fade-in mt-1">
                    {props.error}
                </div>}
        </div>
    );
}