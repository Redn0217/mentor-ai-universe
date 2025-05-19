
import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

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

export interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLDivElement,
  SidebarMenuButtonProps
>(({ className, asChild, children, ...props }, ref) => {
  const { collapsed } = useSidebar();
  
  // If asChild is true, we just render children directly
  if (asChild && React.isValidElement(children)) {
    // Remove the ref from props to avoid passing it down directly
    const { ref: _omitRef, ...restProps } = props as any;
    
    return React.cloneElement(children, {
      className: cn(
        "flex w-full cursor-pointer rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        collapsed && "justify-center",
        className,
        children.props.className
      ),
      ...restProps
    });
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full cursor-pointer rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        collapsed && "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";
