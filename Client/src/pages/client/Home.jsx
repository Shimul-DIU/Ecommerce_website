import NewArrivals from '../../components/home/NewArrivals';
import HeroBanner from '../../components/common/HeroBanner';
import Filter from './../../components/Filter';

const Home = () => (
  <div>
    <HeroBanner />
    <div className="flex ">
      <div className='hidden md:block'>
      <Filter/>
      </div>
      <div className='flex-1 order-1 md:order-2'>
        <NewArrivals />
      </div>
    </div>
  </div>
);

export default Home;