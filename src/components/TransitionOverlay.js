"use client";

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const TransitionOverlay = ({ isActive }) => {
  const shouldReduce = useReducedMotion();

  const duration = shouldReduce ? 0.1 : 1.2;

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center">
          {/* Wave Wipe Layer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ x: "100%" }}
            transition={{ duration: duration, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-brand-green-dark to-transparent opacity-95 pointer-events-auto"
          />

          {/* Swimming Turtle Container */}
          {!shouldReduce && (
            <motion.div
              initial={{ x: "-150px", opacity: 0, rotate: 90, scale: 0.8 }}
              animate={{ 
                x: ["-150px", "50vw", "100vw"],
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{ duration: duration, ease: [0.77, 0, 0.175, 1] }}
              style={{ y: "-50%", position: "absolute", top: "50%", left: 0 }}
              className="w-28 h-28 z-[10000]"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-[0_0_15px_rgba(201,162,39,0.4)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Back Flippers */}
                <path
                  d="M 25,75 C 20,80 15,80 12,76 C 10,72 15,66 22,68 Z"
                  fill="#14532d"
                  stroke="#c9a227"
                  strokeWidth="0.8"
                />
                <path
                  d="M 75,75 C 80,80 85,80 88,76 C 90,72 85,66 78,68 Z"
                  fill="#14532d"
                  stroke="#c9a227"
                  strokeWidth="0.8"
                />

                {/* Tail */}
                <path
                  d="M 47,85 L 50,92 L 53,85 Z"
                  fill="#1b4332"
                  stroke="#c9a227"
                  strokeWidth="0.8"
                />

                {/* Front Left Flipper (animated via CSS in globals.css) */}
                <g className="turtle-left-paddle">
                  <path
                    d="M 30,45 C 10,40 2,22 8,12 C 14,2 24,12 32,32 Z"
                    fill="#14532d"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                </g>

                {/* Front Right Flipper (animated via CSS in globals.css) */}
                <g className="turtle-right-paddle">
                  <path
                    d="M 70,45 C 90,40 98,22 92,12 C 86,2 76,12 68,32 Z"
                    fill="#14532d"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                </g>

                {/* Head */}
                <g>
                  <path
                    d="M 40,25 C 40,12 45,6 50,6 C 55,6 60,12 60,25 Z"
                    fill="#1b4332"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                  {/* Eyes */}
                  <circle cx="45" cy="12" r="1.5" fill="#ffffff" />
                  <circle cx="45" cy="12" r="0.7" fill="#000000" />
                  <circle cx="55" cy="12" r="1.5" fill="#ffffff" />
                  <circle cx="55" cy="12" r="0.7" fill="#000000" />
                </g>

                {/* Carapace / Shell */}
                <g>
                  {/* Outer Rim */}
                  <ellipse
                    cx="50"
                    cy="55"
                    rx="28"
                    ry="32"
                    fill="#14532d"
                    stroke="#c9a227"
                    strokeWidth="1.5"
                  />
                  {/* Hexagon Shell Patterns */}
                  <polygon
                    points="50,32 58,37 58,47 50,52 42,47 42,37"
                    fill="#1b4332"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points="50,52 58,57 58,67 50,72 42,67 42,57"
                    fill="#1b4332"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points="50,72 56,76 56,83 50,86 44,83 44,76"
                    fill="#1b4332"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                  {/* Side hexagons */}
                  <polygon
                    points="42,37 42,47 30,50 25,43 30,34"
                    fill="#1b4332"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points="42,57 42,67 30,70 25,63 30,54"
                    fill="#1b4332"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points="58,37 58,47 70,50 75,43 70,34"
                    fill="#1b4332"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                  <polygon
                    points="58,57 58,67 70,70 75,63 70,54"
                    fill="#1b4332"
                    stroke="#c9a227"
                    strokeWidth="0.8"
                  />
                </g>
              </svg>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransitionOverlay;
