import React from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[520px] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/atN3lqky4IzF-KEP/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Candy sky gradient overlay for Adventure-Time vibes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 via-sky-400/10 to-transparent" />

      <div className="relative h-full flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-[0_6px_0_rgba(0,0,0,0.3)]"
            style={{
              color: '#fffbeb',
              textShadow: '0 2px 0 #00000055, 0 6px 0 #00000055',
            }}
          >
            Blackjack Kingdom
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg md:text-xl text-white/90"
          >
            Deal your destiny in a candy-coated empire. Bright colors, bold moves, big wins.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 inline-flex items-center gap-3"
          >
            <span className="px-4 py-2 rounded-full bg-emerald-400/90 text-emerald-900 font-semibold shadow-md">Playful • Animated • Addictive</span>
            <span className="hidden sm:inline px-4 py-2 rounded-full bg-yellow-300/90 text-yellow-900 font-semibold shadow-md">Empire Aesthetic</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
