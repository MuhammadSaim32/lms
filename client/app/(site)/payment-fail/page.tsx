"use client";
import Link from "next/link";

export default function PaymentFail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl backdrop-blur-xl max-w-md w-full mx-4">
        <h1 className="text-3xl font-extrabold text-red-400">Payment Failed</h1>
        <p className="mt-4 text-slate-300">
          Unfortunately the payment did not complete. Please check your details and try again.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/20 w-full"
        >
          Go back Home
        </Link>
      </div>
    </div>
  );
}
