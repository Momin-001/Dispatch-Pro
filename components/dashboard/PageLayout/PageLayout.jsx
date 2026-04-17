"use client";
import { RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";

export function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children} {/* This is where your top-right action buttons go */}
      </div>
    </div>
  );
}

export function FilterBar({ onReset, children }) {
  return (
    <Card className="flex flex-row flex-wrap px-4 py-3 items-center justify-between gap-3">
      <div className="flex items-center flex-wrap gap-2 flex-1">
        {children} {/* This is where your Inputs and Selects go */}
      </div>
      {onReset && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary-dark hover:text-primary-dark/80"
          >
            <RotateCcw className="size-3.5" />
            Reset Filters
          </button>
        </div>
      )}
    </Card>
  );
}