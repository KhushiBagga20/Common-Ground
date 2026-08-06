import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Ground from './pages/Ground';
import Explore from './pages/Explore';
import Community from './pages/Community';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/ground" element={<Ground />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/community/:id" element={<Community />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
