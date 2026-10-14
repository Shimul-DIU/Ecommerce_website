import { useState, useEffect, useRef } from "react";

/**
 * Returns true when the navbar's "collapsed" row should be hidden.
 * - Near the top (<= threshold)  -> false (show)
 * - Scrolling down               -> true  (hide)
 * - Fast scroll up               -> false (show)
 *   (at least `fastDistance` px upward within `windowMs` ms)
 * - Slow scroll up               -> stays hidden
 */
export const useScroll = (
  threshold = 80,
  fastDistance = 370,
  windowMs = 300
) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);
  const lastY = useRef(0);
  const upDistance = useRef(0);
  const upWindowStart = useRef(0);
  const userScrollIntent = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const resetUp = () => {
      upDistance.current = 0;
      upWindowStart.current = 0;
    };

    const markUserScrollIntent = () => {
      userScrollIntent.current = true;
    };

    const keepNavbarVisible = () => {
      userScrollIntent.current = false;
      lastY.current = window.scrollY;
      resetUp();
      setIsScrolled(false);
    };

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastY.current;
        const now = performance.now();

        if (currentY <= threshold) {
          // near top -> always show
          resetUp();
          setIsScrolled(false);
        } else if (userScrollIntent.current) {
          if (diff > 0) {
            // scrolling down -> hide and reset the up counter
            resetUp();
            setIsScrolled(true);
          } else if (diff < 0) {
            // start a new time window if none is running or it expired
            if (
              upWindowStart.current === 0 ||
              now - upWindowStart.current > windowMs
            ) {
              upWindowStart.current = now;
              upDistance.current = 0;
            }

            upDistance.current += -diff;

            // enough distance inside the window = fast scroll up
            if (upDistance.current >= fastDistance) {
              setIsScrolled(false);
              resetUp();
            }
          }
        }

        lastY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("wheel", markUserScrollIntent, { passive: true });
    window.addEventListener("touchstart", markUserScrollIntent, { passive: true });
    window.addEventListener("mousedown", markUserScrollIntent, { passive: true });
    window.addEventListener("keydown", markUserScrollIntent);
    window.addEventListener("navbar:keep-visible", keepNavbarVisible);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", markUserScrollIntent);
      window.removeEventListener("touchstart", markUserScrollIntent);
      window.removeEventListener("mousedown", markUserScrollIntent);
      window.removeEventListener("keydown", markUserScrollIntent);
      window.removeEventListener("navbar:keep-visible", keepNavbarVisible);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, fastDistance, windowMs]);

  return isScrolled;
};