import { motion } from 'framer-motion';
import { staggerItem } from '../../animations/variants';
import Burst from './Burst';
import './PageHeader.css';

/**
 * Colourful page hero: a band in the page's dock colour with grain, a
 * halftone field and a pattern, a mono channel kicker, a poster headline
 * whose last word is set in an outlined accent colour, and an optional
 * starburst sticker.
 *
 * pattern: 'dots' | 'stripes' | 'grid' | 'rings'
 */
export default function PageHeader({
  channel,
  name,
  title,
  highlight,
  subtitle,
  color = 'var(--yellow)',
  highlightColor = 'var(--pink)',
  pattern = 'dots',
  burst,
  burstColor = 'var(--green)',
  art,
  children,
}) {
  return (
    <motion.header
      className={`page-hero page-hero--${pattern}`}
      style={{ '--hero-color': color, '--outline-fill': highlightColor }}
      variants={staggerItem}
    >
      <span className="page-hero__halftone" aria-hidden="true" />

      <div className="page-hero__body">
        <span className="page-hero__kicker mono-label">
          <span className="page-hero__led" aria-hidden="true" />
          {channel ? `Channel ${String(channel).padStart(2, '0')} · ${name}` : name}
        </span>
        <h1 className="page-hero__title display">
          {title}
          {highlight && <> <span className="outline-word">{highlight}</span></>}
        </h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
        {children && <div className="page-hero__actions">{children}</div>}
      </div>

      {art && <div className="page-hero__art" aria-hidden="true">{art}</div>}
      {burst && <Burst text={burst} color={burstColor} className="page-hero__burst" />}
    </motion.header>
  );
}
