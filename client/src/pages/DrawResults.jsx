import Navbar from '../components/common/Navbar.jsx';
import DrawHistory from '../components/dashboard/DrawHistory.jsx';

const DrawResults = () => {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        <DrawHistory />
      </div>
    </>
  );
};

export default DrawResults;