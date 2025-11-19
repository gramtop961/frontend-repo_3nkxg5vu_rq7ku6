import React, { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import BlackjackTable from './components/BlackjackTable'
import KingdomUI from './components/KingdomUI'

const suits = ['♠','♥','♦','♣']
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

function createDeck(){
  const cards = []
  for(const s of suits){
    for(const r of ranks){
      cards.push({ suit: s, rank: r })
    }
  }
  // duplicate deck for more flow
  return [...cards, ...cards]
}

function shuffle(array){
  const arr = [...array]
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()* (i+1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

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

export default function App(){
  const [bank, setBank] = useState(500)
  const [bet, setBet] = useState(20)
  const [shoe, setShoe] = useState(shuffle(createDeck()))
  const [dealer, setDealer] = useState([])
  const [player, setPlayer] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [canAct, setCanAct] = useState(false)
  const [outcome, setOutcome] = useState('')

  const dealCard = useCallback(()=>{
    setShoe(prev => {
      const next = [...prev]
      const card = next.pop()
      // if shoe low, refresh
      if(next.length < 15){
        setTimeout(()=> setShoe(shuffle(createDeck())), 0)
      }
      // distribute card via side-effect
      if(!card) return prev
      if(dealer.length <= player.length){
        setDealer(d=>[...d, card])
      } else {
        setPlayer(p=>[...p, card])
      }
      return next
    })
  }, [dealer.length, player.length])

  const startRound = useCallback(()=>{
    if(bank < bet) return
    setOutcome('')
    setDealer([])
    setPlayer([])
    setRevealed(false)
    setCanAct(false)
    // take bet
    setBank(b=>b-bet)
    // deal with rhythm
    setTimeout(dealCard, 150)
    setTimeout(dealCard, 450)
    setTimeout(dealCard, 750)
    setTimeout(()=>{ setCanAct(true); }, 1100)
  },[bank, bet, dealCard])

  const hit = useCallback(()=>{
    if(!canAct) return
    // push one to player
    setShoe(prev=>{
      const next = [...prev]
      const card = next.pop()
      if(!card) return prev
      setPlayer(p=>[...p, card])
      return next
    })
  },[canAct])

  const stand = useCallback(()=>{
    if(!canAct) return
    setCanAct(false)
    setRevealed(true)
    // dealer draws to 17+
    const draw = () => {
      const dScore = scoreHand(dealer)
      if(dScore < 17){
        setShoe(prev=>{
          const next=[...prev]
          const card = next.pop()
          if(card){ setDealer(d=>[...d, card]) }
          return next
        })
        setTimeout(draw, 450)
      } else {
        // settle
        const pScore = scoreHand(player)
        const result =
          pScore>21 ? 'You Busted' :
          dScore>21 ? 'Dealer Busts — You Win!' :
          pScore>dScore ? 'You Win!' :
          pScore<dScore ? 'Dealer Wins' : 'Push'
        setOutcome(result)
        if(result.includes('Win')) setBank(b=>b + bet*2)
        if(result==='Push') setBank(b=>b + bet)
      }
    }
    setTimeout(draw, 500)
  },[canAct, dealer, player, bet])

  const state = { dealer, player, revealed, canAct, outcome }
  const actions = { hit, stand, deal: startRound }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-indigo-500 to-purple-700 text-white">
      <Hero />
      <KingdomUI bank={bank} bet={bet} onBetChange={setBet} />
      <BlackjackTable state={state} actions={actions} />

      {/* Sticky play bar */}
      <div className="fixed bottom-6 inset-x-0 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3">
          <motion.button onClick={startRound} whileTap={{ scale: 0.95 }}
            className="col-span-2 py-4 rounded-3xl bg-pink-300 text-pink-900 font-extrabold border-4 border-pink-700 shadow-[0_10px_0_#000]">
            Start Round
          </motion.button>
          <motion.button onClick={()=>{ setBank(500); setBet(20) }} whileTap={{ scale: 0.95 }}
            className="col-span-1 py-4 rounded-3xl bg-violet-300 text-violet-900 font-extrabold border-4 border-violet-700 shadow-[0_10px_0_#000]">
            Reset
          </motion.button>
        </div>
      </div>

      {/* Clouds */}
      <AnimatePresence>
        {Array.from({length:4}).map((_,i)=> (
          <motion.div key={i}
            initial={{ x: -200, opacity: 0.6 }}
            animate={{ x: '110vw' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 40 + i*10, ease: 'linear', repeat: Infinity, repeatType: 'loop', delay: i*4 }}
            className="pointer-events-none fixed top-[20%] left-[-20%] w-64 h-24 bg-white/30 rounded-full blur-2xl"
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
