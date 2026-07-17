"use client";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded  text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful
        </h1>
        <p className="mt-4">
          Thank you — your payment was completed successfully.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
