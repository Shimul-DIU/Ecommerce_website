import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faTruckFast,
  faRotateLeft,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "../../utils/translations";

// এখানে নিজের আসল সুবিধাগুলো বসান
const features = [
  {
    id: 1,
    icon: faMoneyBillWave,
    title: "Cash on Delivery",
    desc: "Pay when you receive your product at your door.",
  },
  {
    id: 2,
    icon: faTruckFast,
    title: "Fast Delivery",
    desc: "Quick delivery all over Bangladesh. Free over ৳2000.",
  },
  {
    id: 3,
    icon: faRotateLeft,
    title: "Easy Return",
    desc: "Not satisfied? Return your product without any hassle.",
  },
  {
    id: 4,
    icon: faShieldHalved,
    title: "100% Original",
    desc: "Every product is genuine and quality checked.",
  },
];

const WhyChooseUs = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full px-2 sm:px-4 md:px-8 mt-8 sm:mt-10 mb-4">
      <div className="text-left mb-5 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-extrabold text-[#16241F]">
          {t("Why Choose Us")}
        </h2>
        <div className="w-16 h-1 bg-[#B08946] rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {features.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col items-center text-center bg-white border border-[#E4DDCE] hover:border-[#B08946]/60 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#16241F] text-[#B08946] flex items-center justify-center text-lg sm:text-2xl shadow-md mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-[#B08946] group-hover:text-white">
              <FontAwesomeIcon icon={item.icon} />
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#16241F] mb-1">
              {t(item.title)}
            </h3>

            <p className="text-[11px] sm:text-sm text-[#16241F]/60 font-medium leading-relaxed">
              {t(item.desc)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;