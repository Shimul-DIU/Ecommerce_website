import { useTranslation } from "../../utils/translations";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{t("About Us")}</h1>
      <p className="text-gray-600 mt-4">{t("Learn more about our company and mission")}</p>
    </div>
  );
};

export default About;