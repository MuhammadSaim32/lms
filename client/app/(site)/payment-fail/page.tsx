"use client";
import Link from "next/link";

export default function PaymentFail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded  text-center">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p className="mt-4">
          Unfortunately the payment did not complete. Please try again.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
