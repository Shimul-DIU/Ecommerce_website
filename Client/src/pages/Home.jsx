import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import banner1 from "../assets/images/bImg.png";
import banner2 from "../assets/images/bImg2.png";
import banner3 from "../assets/images/bImg3.png";
import banner4 from "../assets/images/bImg4.png";

const Home = () => {
  const banners = [banner1, banner2, banner3, banner4];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentBanner(
      (prev) => (prev - 1 + banners.length) % banners.length
    );
  };

  return (
    <div className="px-8">
      <div className="relative overflow-hidden  rounded-xl">

        {/* Slider */}
        <div
          className="h-4/6 flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentBanner * 100}%)`,
          }}
        >
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={`banner-${index}`}
              className="w-full "
            />
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
        >
          <FaChevronLeft />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
        >
          <FaChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-3 w-3 rounded-full ${
                currentBanner === index
                  ? "bg-white"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;