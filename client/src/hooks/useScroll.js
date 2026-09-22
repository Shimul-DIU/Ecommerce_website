import { useState, useEffect, useRef } from "react";

/**
 * Returns true when the navbar's "collapsed" row should be hidden.
 * - Past `threshold` px from the top -> true (hide)
 * - Near the top of the page         -> false (show)
 */
export const useScroll = (threshold = 80) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);
  const userScrollIntent = useRef(false);

  useEffect(() => {
    const markUserScrollIntent = () => {
      userScrollIntent.current = true;
    };

    const keepNavbarVisible = () => {
      userScrollIntent.current = false;
      setIsScrolled(false);
    };

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (!userScrollIntent.current || currentScrollY <= threshold) {
          // near top -> always show
          setIsScrolled(false);
        } else {
          // Keep the row hidden until the page is close to the top again.
          setIsScrolled(true);
        }

        ticking.current = false;
      });
    };

    window.addEventListener("wheel", markUserScrollIntent, { passive: true });
    window.addEventListener("touchstart", markUserScrollIntent, { passive: true });
    window.addEventListener("keydown", markUserScrollIntent);
    window.addEventListener("navbar:keep-visible", keepNavbarVisible);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", markUserScrollIntent);
      window.removeEventListener("touchstart", markUserScrollIntent);
      window.removeEventListener("keydown", markUserScrollIntent);
      window.removeEventListener("navbar:keep-visible", keepNavbarVisible);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isScrolled;
};