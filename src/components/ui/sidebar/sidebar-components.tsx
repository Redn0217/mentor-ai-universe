
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

const sidebarVariants = cva(
  [
    "relative flex h-full flex-col overflow-y-auto border-r bg-background transition-[width] duration-200",
  ],
  {
    variants: {
      collapsible: {
        true: "overflow-hidden",
        false: null,
      },
    },
    defaultVariants: {
      collapsible: false,
    },
  }
);

interface SidebarProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, collapsible, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(sidebarVariants({ collapsible }), className)}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  SidebarHeaderProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-14 items-center border-b px-4 py-2 lg:h-[60px]",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SidebarHeader.displayName = "SidebarHeader";

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarContentProps
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props}>
    {children}
  </div>
));
SidebarContent.displayName = "SidebarContent";

export interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, children, ...props }, ref) => {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    >
      {children || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "transition-transform",
            collapsed ? "rotate-180" : "rotate-0"
          )}
        >
          <path d="m15 6-6 6 6 6" />
        </svg>
      )}
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
