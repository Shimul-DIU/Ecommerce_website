import { useState, useEffect, useRef } from "react";

/**
 * Returns true when the navbar's "collapsed" row should be hidden.
 * - Past `threshold` px from the top -> true (hide)
 * - Near the top of the page         -> false (show)
 */
export const useScroll = (threshold = 80) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= threshold) {
          // near top -> always show
          setIsScrolled(false);
        } else {
          // Keep the row hidden until the page is close to the top again.
          setIsScrolled(true);
        }

        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
};