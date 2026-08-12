import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]",
        secondary:
          "border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700",
        destructive:
          "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
        outline:
          "text-slate-300 border-slate-700/80 bg-slate-900/50 backdrop-blur-md hover:bg-slate-800/50",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        blue:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
