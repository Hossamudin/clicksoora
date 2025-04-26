"use client";

import React from 'react';
import { motion as framerMotion } from 'framer-motion';

// Export specific motion components to avoid the "export *" issue
export const motion = {
  div: framerMotion.div,
  section: framerMotion.section,
  header: framerMotion.header,
  footer: framerMotion.footer,
  h1: framerMotion.h1,
  h2: framerMotion.h2,
  h3: framerMotion.h3,
  h4: framerMotion.h4,
  p: framerMotion.p,
  span: framerMotion.span,
  button: framerMotion.button,
  a: framerMotion.a,
  ul: framerMotion.ul,
  li: framerMotion.li,
  img: framerMotion.img,
};

// Animation presets
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Transition presets
export const transitions = {
  default: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
  slow: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
  fast: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] },
};
