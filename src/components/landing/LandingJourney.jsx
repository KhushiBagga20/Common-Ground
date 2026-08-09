import { motion } from 'framer-motion';
import Stepper, { Step } from '../common/Stepper';
import './LandingJourney.css';

/* ---------------------------------------------------------------
   LANDING JOURNEY — React Bits Stepper Integration
   --------------------------------------------------------------- */

const JOURNEY_STEPS = [
  {
    stepNum: '01',
    badge: 'DISCOVER',
    title: '1. Find What Excites You ✦',
    description: 'Swipe through real hobbies and interests to discover what sparks your curiosity — photography, film, guitar, pottery, or running.',
    color: '#FFD43B',
    annotation: 'curiosity first'
  },
  {
    stepNum: '02',
    badge: 'EXPLORE',
    title: '2. See What People Are Doing ✦',
    description: 'Browse active local communities, project showcases, photowalks, and genuine discussions happening around your interests.',
    color: '#4D7CFE',
    annotation: 'real communities'
  },
  {
    stepNum: '03',
    badge: 'PARTICIPATE',
    title: '3. Share & Get Involved ✦',
    description: 'Ask questions, share project ideas, post photos, and engage without worrying about follower counts or popularity algorithms.',
    color: '#FF72B6',
    annotation: 'zero vanity metrics'
  },
  {
    stepNum: '04',
    badge: 'CONNECT',
    title: '4. Find Your People ✦',
    description: 'Step into real-world meetups, local hobby circles, and build lasting friendships grounded in genuine shared passion.',
    color: '#5BCB77',
    annotation: 'real world connection'
  }
];

export default function LandingJourney() {
  return (
    <motion.section
      className="ljourney"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="ljourney__inner">
        {/* Header with Green Ribbon Badge */}
        <motion.div
          className="ljourney__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="ljourney__label">Four Steps. That's It.</span>
        </motion.div>

        {/* Stepper Component */}
        <Stepper
          initialStep={1}
          onStepChange={step => console.log('Current Step:', step)}
          onFinalStepCompleted={() => console.log('Journey completed!')}
          backButtonText="← Back"
          nextButtonText="Next Step →"
        >
          {JOURNEY_STEPS.map(item => (
            <Step key={item.stepNum}>
              <div className="ljourney__step-content">
                <div className="ljourney__step-meta">
                  <span
                    className="ljourney__step-tag"
                    style={{ background: item.color }}
                  >
                    {item.badge}
                  </span>
                  <span className="ljourney__step-annotation font-accent">
                    {item.annotation}
                  </span>
                </div>

                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </Step>
          ))}
        </Stepper>
      </div>
    </motion.section>
  );
}
