import { motion } from 'framer-motion';
import { Compass, Sparkles, UserPlus, MessageSquare, PlusCircle } from 'lucide-react';
import './JourneySteps.css';

const STEPS = [
  { id: 'discover', label: 'Discover', icon: Sparkles, desc: 'Find something curious' },
  { id: 'explore', label: 'Explore', icon: Compass, desc: 'Deep dive into interests' },
  { id: 'join', label: 'Join', icon: UserPlus, desc: 'Become part of a community' },
  { id: 'participate', label: 'Participate', icon: MessageSquare, desc: 'Share ideas & discussions' },
  { id: 'create', label: 'Create', icon: PlusCircle, desc: 'Build projects & connections' },
];

export default function JourneySteps({ currentStep = 'join' }) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="journey-steps">
      <div className="journey-steps__header">
        <span className="font-accent journey-steps__tagline">your journey on CommonGround</span>
      </div>
      <div className="journey-steps__stairs">
        {STEPS.map((step, idx) => {
          const isDone = idx <= (currentIndex >= 0 ? currentIndex : 1);
          const isCurrent = idx === (currentIndex >= 0 ? currentIndex : 1);
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              className={`journey-step ${isDone ? 'journey-step--done' : ''} ${isCurrent ? 'journey-step--current' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
            >
              <div className="journey-step__block">
                <div className="journey-step__icon">
                  <Icon size={16} />
                </div>
                <div className="journey-step__content">
                  <span className="journey-step__label">{step.label}</span>
                  <span className="journey-step__desc text-muted">{step.desc}</span>
                </div>
              </div>
              {idx < STEPS.length - 1 && <div className="journey-step__connector" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
