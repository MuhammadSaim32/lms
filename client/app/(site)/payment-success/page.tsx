"use client";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl backdrop-blur-xl max-w-md w-full mx-4">
        <h1 className="text-3xl font-extrabold text-emerald-400">
          Payment Successful
        </h1>
        <p className="mt-4 text-slate-300">
          Thank you — your payment was completed successfully. Your course is now available.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20 w-full"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
