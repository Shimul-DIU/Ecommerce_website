import NewArrivals from '../../components/home/NewArrivals';
import HeroBanner from '../../components/common/HeroBanner';
// import Filter from './../../components/Filter';
import DealOfTheDay from '../../components/home/DealOFTheDay';
import DevelopmentPopup from '../../components/common/DevelopmentPopup';
import TopCategories from '../../components/client/TopCategories';

const Home = () => (
  <div>
    <HeroBanner />

      {/* <div className='hidden md:block'>
      <Filter/>
      </div> */}
      <div>
        <DealOfTheDay />
      </div>
    <DevelopmentPopup></DevelopmentPopup>
    <div >
      <TopCategories/>
      <NewArrivals />
    </div>
  </div>
);

export default Home;