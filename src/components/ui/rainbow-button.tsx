import React from "react";

import { cn } from "@/lib/utils";
interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <div className="relative inline-block">
      {/* Rainbow bottom glow animation */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1 rounded-full opacity-80 blur-sm animate-rainbow-slide"
        style={{
          background: `linear-gradient(90deg,
            #ff0000, #ff8000, #ffff00, #80ff00,
            #00ff00, #00ff80, #00ffff, #0080ff,
            #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000
          )`,
          backgroundSize: '300% 100%'
        }}
      />

      {/* Main button */}
      <button
        className={cn(
          "relative inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white transition-all duration-300",
          "bg-gray-900 hover:bg-gray-800",
          "border border-gray-700 hover:border-gray-600",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:scale-105",
          className,
        )}
        {...props}
      >
        <span className="relative z-10 font-semibold">{children}</span>
      </button>
    </div>
  );
}
