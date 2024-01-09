import { Route, Routes, HashRouter as Router } from 'react-router-dom';
import AppLayout from './pages/layouts';
import LandingPage from 'pages/landingpage';
import ConnectWallet from 'pages/connect-wallet';
import LoadingPanel from 'pages/loading-panel';
import Oracle from 'pages/admin/oracle';
import FullScreenAlert from 'components/account/full-screen-alert';

function MainRouter() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/alert/:type" element={<FullScreenAlert />} />
        <Route path="/load-data/*" element={<LoadingPanel />} />
        <Route path="/wallet-connect/*" element={<ConnectWallet redirectLink='/load-data'/>} />
        <Route path="/admin/oracle" element={<Oracle />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
