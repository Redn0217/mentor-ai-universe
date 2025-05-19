
import * as React from "react";

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
