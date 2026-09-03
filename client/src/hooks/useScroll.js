import { useState, useEffect, useRef } from "react";

/**
 * Returns true when the navbar's "collapsed" row should be hidden.
 * - Scrolling DOWN past `threshold` px  -> true (hide)
 * - Scrolling UP (any amount)          -> false (show)
 * - Near the top of the page           -> false (always show)
 */
export const useScroll = (threshold = 80) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
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
        } else if (currentScrollY > lastScrollY.current) {
          // scrolling down -> hide
          setIsScrolled(true);
        } else if (currentScrollY < lastScrollY.current) {
          // scrolling up -> show
          setIsScrolled(false);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
};