
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  collapsedWidth: number;
}>({
  collapsed: false,
  setCollapsed: () => {},
  collapsedWidth: 0,
});

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export interface SidebarProviderProps {
  children: React.ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  collapsedWidth?: number;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function SidebarProvider({
  children,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  collapsedWidth = 16,
  onCollapsedChange,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState<boolean>(
    controlledCollapsed !== undefined ? controlledCollapsed : defaultCollapsed
  );

  const setCollapsedState = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const newValue =
        typeof value === "function" ? value(collapsed) : value;
      setCollapsed(newValue);
      onCollapsedChange?.(newValue);
    },
    [collapsed, onCollapsedChange]
  );

  const isControlled = controlledCollapsed !== undefined;
  const memoizedCollapsed = React.useMemo(
    () => (isControlled ? controlledCollapsed : collapsed),
    [isControlled, controlledCollapsed, collapsed]
  );

  return (
    <SidebarContext.Provider
      value={{
        collapsed: memoizedCollapsed,
        setCollapsed: setCollapsedState,
        collapsedWidth,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

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

interface SidebarElement
  extends React.ElementRef<"aside">,
    VariantProps<typeof sidebarVariants> {
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar = React.forwardRef<SidebarElement, SidebarElement>(
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
        "inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
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

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-2", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("block", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebar();

  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full cursor-pointer rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        collapsed && "justify-center",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";
