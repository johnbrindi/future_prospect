import React from "react";
import { cva } from "class-variance-authority";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext({
  isOpen: true,
  toggle: () => {},
});

export function SidebarProvider({ children, defaultIsOpen = true }) {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarTrigger() {
  const { toggle } = useSidebarContext();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="md:hidden"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

export function Sidebar({ className, ...props }) {
  const { isOpen } = useSidebarContext();
  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-[270px] flex-col bg-background transition-transform md:static",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
      )}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }) {
  return <div className={cn("flex-1 overflow-auto", className)} {...props} />;
}

export function SidebarHeader({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }) {
  return <div className={cn("mt-auto p-4", className)} {...props} />;
}

export function SidebarGroup({ className, ...props }) {
  return <div className={cn("px-2 py-2", className)} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }) {
  return (
    <div
      className={cn("px-2 py-1 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }) {
  return <div className={className} {...props} />;
}

export function SidebarMenuButton({ className, asChild = false, ...props }) {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenuLabel({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex-1 truncate text-sm font-medium leading-none text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}