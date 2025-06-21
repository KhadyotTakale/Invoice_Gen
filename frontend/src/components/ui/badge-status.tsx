
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Status } from "@/types";

const statusVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        pending: "bg-indigo-100 text-indigo-800",
        approved: "bg-green-100 text-green-800",
        converted: "bg-cyan-100 text-cyan-800",
        cancelled: "bg-red-100 text-red-800",
        default: "bg-gray-100 text-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  status: Status;
}

export function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  return (
    <div
      className={cn(statusVariants({ variant: status }), className)}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
