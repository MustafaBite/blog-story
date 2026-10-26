import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function StoryCardSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl overflow-hidden border ${
        isDark ? "border-dark-700/50 bg-dark-800/50" : "border-slate-200 bg-white"
      }`}
    >
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ArtworkCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Skeleton className="w-full" style={{ paddingBottom: "130%" }} />
    </div>
  );
}
