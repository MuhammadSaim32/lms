"use client";
import { useEffect, useState } from "react";
import layoutApi from "../api/LayoutApi";
import routes from "../routes";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
}

export default function Faq() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [down, setDown] = useState<number | null>(null);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const data = await layoutApi.getLayout(routes.getLayout("FAQ"));
        if (data?.layout?.faq) {
          setFaqItems(data.layout.faq);
        }
      } catch (error) {
        console.error("Failed to fetch FAQ:", error);
      }
    };
    fetchFaq();
  }, []);

  return (
    <div id="faq" className="w-full space-y-8">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <LiveHelpIcon className="w-4 h-4" />
          Got Questions?
        </span>
        <h2 className="font-extrabold text-3xl sm:text-4xl text-center text-white tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="w-full space-y-3">
        {faqItems && faqItems.length > 0 ? (
          faqItems.map((val, idx) => {
            const isOpen = down === idx;
            return (
              <div
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-200"
                key={idx}
              >
                <button
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                  onClick={() => setDown(isOpen ? null : idx)}
                >
                  <span className="font-semibold text-base text-slate-100 pr-4">
                    {val.question}
                  </span>
                  <span className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
                    {isOpen ? <RemoveIcon className="w-4 h-4" /> : <AddIcon className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {val.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-xs text-slate-500 py-6">
            No questions available currently.
          </p>
        )}
      </div>
    </div>
  );
}