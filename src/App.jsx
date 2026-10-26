import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import ChannelCurtain from './components/layout/ChannelCurtain';
import Toasts from './components/common/Toasts';
import Confetti from './components/common/Confetti';
import SignInDialog from './components/auth/SignInDialog';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Ground from './pages/Ground';
import Explore from './pages/Explore';
import Events from './pages/Events';
import Community from './pages/Community';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    // reducedMotion="user": framer animations follow the OS "reduce motion" setting
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <AppDataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/ground" element={<Ground />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/events" element={<Events />} />
                <Route path="/community/:id" element={<Community />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
            <ChannelCurtain />
            <Confetti />
            <Toasts />
            <SignInDialog />
          </BrowserRouter>
        </AppDataProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
