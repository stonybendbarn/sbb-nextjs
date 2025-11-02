// components/ui/alert.tsx

import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "success" | "error" | "default";
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = "default", children, className }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variant === "success" && "bg-green-50 border-green-200 text-green-900",
        variant === "error" && "bg-red-50 border-red-200 text-red-900",
        variant === "default" && "bg-muted border-border",
        className
      )}
    >
      <div className="flex items-start gap-2">
        {variant === "success" && <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />}
        {variant === "error" && <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export function AlertDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

