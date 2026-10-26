import { useNavigate } from 'react-router-dom';
import PageCanvas from '../components/layout/PageCanvas';
import Button from '../components/common/Button';
import Smiley from '../components/common/Smiley';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageCanvas>
      <KineticCheckerboard />
      <div className="not-found">
        <Smiley size={48} mood="neutral" />
        <h2>Page not found</h2>
        <p className="text-muted">This page wandered off. Let's get you back on common ground.</p>
        <Button onClick={() => navigate('/ground')}>Back to Ground</Button>
      </div>
    </PageCanvas>
  );
}
