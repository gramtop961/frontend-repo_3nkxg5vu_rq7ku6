import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Sword, Castle, Coins } from 'lucide-react'

export default function KingdomUI({bank, bet, onBetChange}){
  return (
    <div className="relative max-w-5xl mx-auto px-6 -mt-10">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-3xl p-5 md:p-6 bg-gradient-to-br from-purple-700 to-indigo-800 border-4 border-indigo-900 shadow-[0_16px_0_#000] text-yellow-100"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-300 border-4 border-yellow-700 grid place-items-center shadow-[0_6px_0_#000]">
              <Crown className="text-yellow-900" />
            </div>
            <div>
              <div className="font-black text-xl drop-shadow">Kingdom Bank</div>
              <div className="text-yellow-200/90">{bank} Gold</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-yellow-300 text-yellow-900 border-4 border-yellow-700 shadow-[0_6px_0_#000]">
              <Coins size={18} />
              <span className="font-extrabold">Bet</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>onBetChange(Math.max(10, bet-10))} className="w-10 h-10 rounded-xl bg-rose-300 border-4 border-rose-700 font-black text-rose-900 shadow-[0_6px_0_#000]">-</button>
              <div className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 font-black border-4 border-amber-700 shadow-[0_6px_0_#000] min-w-[80px] text-center">{bet}</div>
              <button onClick={()=>onBetChange(bet+10)} className="w-10 h-10 rounded-xl bg-emerald-300 border-4 border-emerald-700 font-black text-emerald-900 shadow-[0_6px_0_#000]">+</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
