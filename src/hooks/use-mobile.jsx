import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = (event) => {
      setIsMobile(event.matches);
    };

    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Add listener for changes
    mql.addEventListener("change", onChange);
    
    // Cleanup listener on unmount
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return isMobile; // Return boolean value directly
}