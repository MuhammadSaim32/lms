import { CircularProgress } from "@mui/material"

export default function Loading({ size }) {
    return <div className="min-h-screen min-w-screen flex items-center justify-center bg-slate-800 text-white">
        <CircularProgress size={size} aria-label="Loading…" />
    </div>
}