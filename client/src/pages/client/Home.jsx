import NewArrivals from '../../components/home/NewArrivals';
import HeroBanner from '../../components/common/HeroBanner';
import DealOfTheDay from '../../components/home/DealOFTheDay';
import DevelopmentPopup from '../../components/common/DevelopmentPopup';
import TopCategories from '../../components/client/TopCategories';
import SidebarCategories from '../../components/client/SidebarCategories';

const Home = () => (
  <div className="max-w-7xl mx-auto px-1 sm:px-2 md:px-3 pt-10 space-y-5">
    <DevelopmentPopup />

    <HeroBanner />

    <DealOfTheDay />

    <TopCategories />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4  items-start">
      <aside className="lg:col-span-3 w-full ">
        <SidebarCategories />
      </aside>

      <main className="lg:col-span-9 w-full">
        <NewArrivals />
      </main>
    </div>
  </div>
);

export default Home;