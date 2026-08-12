export default function Button({ text, type, className, ...props }) {
    return (
        <button
            type={type || "button"}
            className={`w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-40 ${className}`}
            {...props}
        >
            {text}
        </button>
    );
}