import { CircularProgress } from "@mui/material"

export default function Loading({ size }) {
    return <div className="w-full h-full min-h-screen flex items-center justify-center bg-slate-950 text-indigo-500 selection:bg-indigo-500/30">
        <CircularProgress size={size} sx={{ color: "currentColor" }} aria-label="Loading…" />
    </div>
}