
import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  SidebarGroupProps
>(({ className, children, defaultOpen, open, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen || false);
  const isControlled = open !== undefined;
  const memoizedOpen = React.useMemo(
    () => (isControlled ? open : isOpen),
    [isControlled, open, isOpen]
  );

  return (
    <div
      ref={ref}
      data-open={memoizedOpen}
      className={cn("space-y-1", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SidebarGroupContent) {
            return React.cloneElement(child, {
              open: memoizedOpen,
            } as any);
          }
          if (child.type === SidebarGroupLabel) {
            return React.cloneElement(child, {
              onClick: () => {
                const newOpen = !memoizedOpen;
                setIsOpen(newOpen);
                onOpenChange?.(newOpen);
              },
              open: memoizedOpen,
            } as any);
          }
          return child;
        }
        return null;
      })}
    </div>
  );
});
SidebarGroup.displayName = "SidebarGroup";

export interface SidebarGroupLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, children, open, ...props }, ref) => {
  const { collapsed } = useSidebar();

  if (collapsed) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      <div>{children}</div>
      {open !== undefined && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("transition-transform", open ? "rotate-0" : "-rotate-90")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </div>
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export interface SidebarGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(({ className, children, open = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden transition-all",
        open ? "max-h-[1000px] animate-in fade-in" : "max-h-0 animate-out fade-out"
      )}
      {...props}
    >
      <div className="px-1 py-0.5">{children}</div>
    </div>
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";
