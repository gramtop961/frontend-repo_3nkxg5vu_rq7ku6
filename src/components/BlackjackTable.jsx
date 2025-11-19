import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const suits = ['♠', '♥', '♦', '♣']
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

function valueOf(rank){
  if(rank==='A') return 11
  if(['J','Q','K'].includes(rank)) return 10
  return parseInt(rank,10)
}

function scoreHand(cards){
  let total = cards.reduce((acc,c)=>acc + valueOf(c.rank),0)
  let aces = cards.filter(c=>c.rank==='A').length
  while(total>21 && aces>0){
    total -= 10
    aces--
  }
  return total
}

function Card({card, i, faceDown}){
  const color = (card.suit==='♥' || card.suit==='♦') ? 'text-rose-500' : 'text-white'
  return (
    <motion.div
      layout
      initial={{ rotate: -6, y: -20, opacity: 0 }}
      animate={{ rotate: 0, y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i*0.08 }}
      className="w-20 h-28 rounded-xl bg-gradient-to-br from-amber-50 to-amber-200 border-4 border-amber-700 shadow-[0_10px_0_#00000070] relative overflow-hidden"
      style={{ perspective: 800 }}
    >
      <motion.div
        initial={{ rotateY: faceDown ? 0 : 180 }}
        animate={{ rotateY: faceDown ? 0 : 180 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full [transform-style:preserve-3d]"
      >
        {/* Back */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 grid place-items-center [backface-visibility:hidden]">
          <div className="w-12 h-12 rounded-xl bg-yellow-300 shadow-inner shadow-black/30 grid place-items-center text-2xl font-black">👑</div>
        </div>
        {/* Front */}
        <div className="absolute inset-0 p-2 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className={`text-2xl font-black ${color}`}>{card.rank}</div>
          <div className={`absolute bottom-2 right-2 text-2xl ${color}`}>{card.suit}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function BlackjackTable({state, actions}){
  const dealerScore = useMemo(()=>scoreHand(state.dealer),[state.dealer])
  const playerScore = useMemo(()=>scoreHand(state.player),[state.player])

  return (
    <section className="relative py-10">
      {/* Kingdom hill background */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-600 via-emerald-500 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.25),transparent_50%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Table */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-emerald-800 to-teal-900 border-4 border-emerald-900 shadow-[0_20px_0_#00000070]"
        >
          {/* Dealer */}
          <div className="flex items-end justify-between">
            <div className="text-yellow-200 font-bold tracking-wider drop-shadow">Dealer</div>
            <div className="text-yellow-300 font-black text-xl">{state.revealed ? dealerScore : '??'}</div>
          </div>
          <div className="mt-3 flex gap-3">
            {state.dealer.map((c,idx)=> (
              <Card key={idx} card={c} i={idx} faceDown={!state.revealed && idx===0} />
            ))}
          </div>

          {/* Divider banner */}
          <div className="my-6 h-2 rounded-full bg-gradient-to-r from-yellow-300 via-pink-300 to-sky-300 shadow-inner" />

          {/* Player */}
          <div className="flex items-end justify-between">
            <div className="text-yellow-200 font-bold tracking-wider drop-shadow">You</div>
            <div className="text-yellow-300 font-black text-xl">{playerScore}</div>
          </div>
          <div className="mt-3 flex gap-3">
            {state.player.map((c,idx)=> (
              <Card key={idx} card={c} i={idx} />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={actions.hit} disabled={!state.canAct}
              className="col-span-1 py-3 rounded-2xl bg-amber-300 text-amber-900 font-extrabold border-4 border-amber-700 shadow-[0_8px_0_#000] disabled:opacity-50">
              HIT
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={actions.stand} disabled={!state.canAct}
              className="col-span-1 py-3 rounded-2xl bg-rose-300 text-rose-900 font-extrabold border-4 border-rose-700 shadow-[0_8px_0_#000] disabled:opacity-50">
              STAND
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={actions.deal}
              className="col-span-1 py-3 rounded-2xl bg-emerald-300 text-emerald-900 font-extrabold border-4 border-emerald-700 shadow-[0_8px_0_#000]">
              DEAL
            </motion.button>
          </div>

          {/* Outcome banner */}
          {state.outcome && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 text-center"
            >
              <span className="inline-block px-6 py-3 rounded-2xl bg-yellow-300 text-yellow-900 font-black border-4 border-yellow-800 shadow-[0_8px_0_#000]">
                {state.outcome}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Floating coins */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({length:12}).map((_,i)=> (
            <motion.div key={i}
              initial={{ y: 0, rotate: 0, opacity: 0 }}
              animate={{ y: [0,-10,0], rotate: [0,10,0], opacity: [0,1,0] }}
              transition={{ duration: 4 + (i%3), repeat: Infinity, delay: i*0.3 }}
              className="absolute w-6 h-6 rounded-full bg-yellow-300 border-2 border-yellow-700 shadow-[0_4px_0_#000]"
              style={{ left: `${(i*7)%100}%`, top: `${(i*13)%60}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
