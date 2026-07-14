import NewArrivals from '../../components/home/NewArrivals';
import HeroBanner from '../../components/common/HeroBanner';
// import Filter from './../../components/Filter';
import DealOfTheDay from '../../components/home/DealOFTheDay';

const Home = () => (
  <div>
    <HeroBanner />

      {/* <div className='hidden md:block'>
      <Filter/>
      </div> */}
      <div>
        <DealOfTheDay />
      </div>
   
    <div >
      <NewArrivals />
    </div>
  </div>
);

export default Home;