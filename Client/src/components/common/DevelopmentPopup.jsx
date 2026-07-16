import { useState, useEffect } from "react";

export default function DevelopmentPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check korche user age ei popup dekhse kina
    const hasSeenPopup = localStorage.getItem("hasSeenDevPopup");

    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);

    localStorage.setItem("hasSeenDevPopup", "true");
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute right-3 top-2 text-2xl text-gray-400 hover:text-gray-700 transition"
        >
          &times;
        </button>

        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          Website is under development
        </h2>

        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          Thank you for visiting! This website is currently being built and
          some features may not work as expected yet. New updates are
          coming soon.
        </p>

        <button
          onClick={handleClose}
          className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
