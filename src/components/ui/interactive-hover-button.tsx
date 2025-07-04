import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-24 cursor-pointer overflow-hidden rounded-full border border-transparent text-center font-medium text-sm",
        "bg-transparent shadow-lg",
        "transition-all duration-300 ease-out",
        className,
      )}
      {...props}
    >
      {/* Glass reflection effect - only on hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Initial text */}
      <span className="relative z-10 inline-block px-3 py-1.5 text-xs transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>

      {/* Hover state with text and arrow */}
      <div className="absolute inset-0 z-20 flex items-center justify-center gap-0.5 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-12">
        <span className="text-xs font-medium">{text}</span>
        <ArrowRight className="h-2.5 w-2.5 flex-shrink-0" />
      </div>

      {/* Animated background dot */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out group-hover:right-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:translate-y-0 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-primary/80 group-hover:to-accent/60" />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
