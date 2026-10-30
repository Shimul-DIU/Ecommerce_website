import NewArrivals from '../../components/home/NewArrivals';
import HeroBanner from '../../components/common/HeroBanner';
import DealOfTheDay from '../../components/home/DealOFTheDay';
import DevelopmentPopup from '../../components/common/DevelopmentPopup';
import TopCategories from '../../components/client/TopCategories';
import BestSellers from '../../components/home/BestSellers';
import LatestProducts from '../../components/home/LatestProducts';

const Home = () => (
  <div className="w-full max-w-none mx-auto px-1 sm:px-2 md:px-3 pt-10 space-y-5">
    <DevelopmentPopup />

    <HeroBanner />

    <DealOfTheDay />

    <TopCategories />

    {/* সাইডবার নেই, তাই পুরো প্রস্থে */}
    <NewArrivals />

    <BestSellers />
    <LatestProducts />
  </div>
);

export default Home;