import { useCallback, useEffect, useRef, useState } from 'react'
import Scene, { ENEMY, ROOM } from './Scene.jsx'
import { SKILLS, PASSIVES, START_RES } from './skills.js'

const FRESH_TURN = { action: false, bonus: false, slot: false, attacked: false, mounted: false }
const COST_LABEL = { none: '', slot1: '1st', slot2: '2nd', cd: 'CD', loh: 'LoH', smite: '1st*', steed: '2nd*' }
let uid = 0

export default function App() {
  const g = {
    player: useRef({ x: 0, z: 4, face: Math.PI }),
    dest: useRef(null),
    mouse: useRef({ x: 0, z: 0 }),
    keys: useRef({}),
    mounted: useRef(false),
    steed: useRef({ summoned: false, x: 0, z: 0, face: 0 }),
    moved: useRef(0),
  }
  const gRef = useRef(g); // stable container across renders
  const G = gRef.current

  const [res, setRes] = useState(START_RES)
  const [turn, setTurn] = useState(FRESH_TURN)
  const [round, setRound] = useState(1)
  const [conc, setConc] = useState(null)
  const [effects, setEffects] = useState([])
  const [log, setLog] = useState([{ id: 0, t: 'Right-click (or left-click) the floor to move. Arrow keys also work. Hover the buttons to learn each skill.', c: 'info' }])
  const [hover, setHover] = useState(null)
  const [movedFt, setMovedFt] = useState(0)
  const [mounted, setMounted] = useState(false)

  const st = useRef({}); st.current = { res, turn, conc }

  useEffect(() => {
    const t = setInterval(() => setMovedFt(Math.round(G.moved.current)), 150)
    return () => clearInterval(t)
  }, [G])

  const say = (t, c = 'info') => setLog((l) => [...l.slice(-7), { id: ++uid, t, c }])

  const addEffects = (skill, extra = {}) => {
    const list = skill.visuals.map((v) => ({ ...v, ...extra, id: ++uid, at: v.at || 'enemy', conc: skill.conc && !v.ttl ? skill.id : null }))
    setEffects((fx) => [...fx.filter((f) => !(skill.conc && f.conc)), ...list])
    list.forEach((f) => { if (f.ttl) setTimeout(() => setEffects((fx) => fx.filter((x) => x.id !== f.id)), f.ttl + (f.delay || 0)) })
  }

  const enemyFt = () => {
    const p = G.player.current
    return Math.max(0, Math.round((Math.hypot(p.x - ENEMY.x, p.z - ENEMY.z) - 0.85) * 5))
  }

  const cast = useCallback((skill) => {
    const { res, turn, conc } = st.current
    const deny = (why) => say(`✗ ${skill.name}: ${why}`, 'bad')

    // --- action economy
    if (skill.kind === 'Action' && turn.action) return deny('you already used your Action this turn (Space = end turn).')
    if (skill.kind === 'Bonus Action' && turn.bonus) return deny('you already used your Bonus Action this turn.')
    if (skill.id === 'vow' && turn.action && !turn.attacked) return deny('the Vow is declared as part of the Attack action, and your Action is spent.')
    if (skill.id === 'smite' && !turn.attacked) return deny('smite is cast right after a melee hit. Attack (A) first.')

    // --- range
    if (skill.target === 'enemy' && skill.rangeFt && enemyFt() > skill.rangeFt) return deny(`out of range (${enemyFt()} ft > ${skill.rangeFt} ft).`)
    if (skill.id === 'misty') {
      const p = G.player.current, m = G.mouse.current
      if (Math.hypot(p.x - m.x, p.z - m.z) * 5 > 30) return deny('aim the cursor within 30 ft of you.')
    }
    if (skill.id === 'mount') {
      const s = G.steed.current, p = G.player.current
      if (!s.summoned) return deny('no steed. Cast Faithful Steed (F) first.')
      if (turn.mounted) return deny('you can mount or dismount only once per turn.')
      if (!G.mounted.current && Math.hypot(p.x - s.x, p.z - s.z) > 2.2) return deny('move within 5 ft of your steed.')
    }

    // --- resources
    let r = { ...res }, usesSlot = false, note = ''
    const slot = (lvl) => {
      if (turn.slot) return 'you can spend only one spell slot per turn (2024 rule).'
      if (r['slot' + lvl] <= 0) return `no ${lvl === 1 ? '1st' : '2nd'}-level slots left (Long Rest).`
      r['slot' + lvl]--; usesSlot = true; note = ` (${lvl === 1 ? '1st' : '2nd'}-level slot)`
    }
    let err
    switch (skill.cost) {
      case 'slot1': err = slot(1); break
      case 'slot2': err = slot(2); break
      case 'cd': if (r.cd <= 0) err = 'no Channel Divinity left (1 back on a Short Rest).'; else { r.cd--; note = ' (1 Channel Divinity)' } break
      case 'loh': if (r.loh <= 0) err = 'Lay on Hands pool is empty.'; else { const n = Math.min(10, r.loh); r.loh -= n; note = ` (${n} HP from the pool)` } break
      case 'smite': if (r.freeSmite > 0) { r.freeSmite--; note = ' (free Paladin\'s Smite)' } else err = slot(1); break
      case 'steed': if (r.freeSteed > 0) { r.freeSteed--; note = ' (free Faithful Steed)' } else err = slot(2); break
    }
    if (err) return deny(err)

    // --- apply
    setRes(r)
    setTurn((t) => ({
      ...t,
      action: t.action || skill.kind === 'Action',
      bonus: t.bonus || skill.kind === 'Bonus Action',
      slot: t.slot || usesSlot,
      attacked: t.attacked || skill.id === 'attack',
      mounted: t.mounted || skill.id === 'mount',
    }))
    if (skill.conc) {
      if (conc && conc !== skill.name) say(`Concentration on ${conc} ends.`, 'warn')
      setConc(skill.name)
    }

    if (skill.id === 'misty') {
      const p = G.player.current, m = G.mouse.current
      const origin = { x: p.x, z: p.z }
      if (G.mounted.current) { G.mounted.current = false; setMounted(false); say('You teleport off your steed.', 'warn') }
      p.x = m.x; p.z = m.z; G.dest.current = null
      addEffects(skill, { origin })
    } else if (skill.id === 'steed') {
      const p = G.player.current, s = G.steed.current
      G.mounted.current = false; setMounted(false)
      Object.assign(s, { summoned: true, x: Math.min(ROOM / 2 - 1.5, p.x + 2), z: p.z, face: 0 })
      addEffects(skill)
    } else if (skill.id === 'mount') {
      const on = !G.mounted.current
      G.mounted.current = on; setMounted(on)
      if (!on) { G.player.current.x += 1.5; G.dest.current = null }
      G.moved.current += 15
      say(`${on ? 'Mounted' : 'Dismounted'}: costs 15 ft of movement.${on ? ' You now move at 60 ft.' : ''}`, 'good')
      return
    } else {
      addEffects(skill)
    }
    say(`✓ ${skill.name}: ${skill.kind}${note}.`, 'good')
  }, [G])

  const endTurn = useCallback(() => {
    setTurn(FRESH_TURN); G.moved.current = 0; setRound((n) => n + 1)
    say('— New turn: Action, Bonus Action, Reaction and movement refreshed.', 'info')
  }, [G])

  const longRest = () => {
    setRes(START_RES); setTurn(FRESH_TURN); setConc(null); G.moved.current = 0; setRound(1)
    setEffects([]); G.steed.current.summoned = false; G.mounted.current = false; setMounted(false)
    say('Long Rest: all slots, Channel Divinity, Lay on Hands and free uses restored.', 'good')
  }

  useEffect(() => {
    const down = (e) => {
      if (e.key.startsWith('Arrow')) { G.keys.current[e.key] = true; e.preventDefault(); return }
      if (e.repeat) return
      if (e.code === 'Space') { e.preventDefault(); endTurn(); return }
      const s = SKILLS.find((k) => k.key === e.key.toUpperCase())
      if (s) cast(s)
    }
    const up = (e) => { G.keys.current[e.key] = false }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [cast, endTurn, G])

  const blocked = (s) =>
    (s.kind === 'Action' && turn.action) || (s.kind === 'Bonus Action' && turn.bonus) ||
    (s.cost === 'slot1' && (turn.slot || res.slot1 <= 0)) || (s.cost === 'slot2' && (turn.slot || res.slot2 <= 0)) ||
    (s.cost === 'cd' && res.cd <= 0) || (s.cost === 'loh' && res.loh <= 0) ||
    (s.id === 'smite' && !turn.attacked) || (s.id === 'mount' && (turn.mounted || !G.steed.current.summoned))

  const btn = (s, small) => (
    <button key={s.id} className={`skill ${small ? 'small' : ''} ${blocked(s) ? 'blocked' : ''} k-${s.kind.split(' ')[0].toLowerCase()}`}
      onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(null)} onClick={() => cast(s)}>
      <span className="icon">{s.icon}</span>
      <span className="key">{s.key}</span>
      {COST_LABEL[s.cost] && <span className="cost">{COST_LABEL[s.cost]}</span>}
    </button>
  )
  const by = (keys) => keys.map((k) => SKILLS.find((s) => s.key === k))
  const limit = mounted ? 60 : 30

  return (
    <div className="app">
      <Scene g={G} effects={effects} previewFt={hover?.rangeFt && hover.rangeFt > 5 ? hover.rangeFt : 0} />

      <div className="panel tl">
        <div className="title">Aldric Sonet · Paladin 6 · Oath of Vengeance</div>
        <div>Spell slots: 1st <b>{res.slot1}</b>/4 · 2nd <b>{res.slot2}</b>/2</div>
        <div>Channel Divinity: <b>{res.cd}</b>/2 · Lay on Hands: <b>{res.loh}</b>/30</div>
        <div>Free Smite: <b>{res.freeSmite}</b> · Free Steed: <b>{res.freeSteed}</b></div>
        <button className="rest" onClick={longRest}>Long Rest</button>
      </div>

      <div className="panel tr">
        <div className="title">Round {round}</div>
        <div className="pips">
          <span className={turn.action ? 'used' : ''}>Action</span>
          <span className={turn.bonus ? 'used' : ''}>Bonus</span>
          <span className={turn.slot ? 'used' : ''}>Slot</span>
        </div>
        <div className={movedFt > limit ? 'over' : ''}>Moved: {movedFt} / {limit} ft{mounted ? ' (mounted)' : ''}</div>
        <div>Concentration: <b>{conc || 'none'}</b></div>
        <div>Enemy distance: <b>{enemyFt()} ft</b></div>
        <button className="rest" onClick={endTurn}>End Turn (Space)</button>
      </div>

      <div className="log">
        {log.map((l) => <div key={l.id} className={l.c}>{l.t}</div>)}
      </div>

      <div className="bar">
        {hover && (
          <div className="tooltip">
            <div className="tt-name">{hover.name} {hover.key && <span className="tt-key">[{hover.key}]</span>}</div>
            <div className="tt-kind">{hover.kind}{hover.conc ? ' · Concentration' : ''}</div>
            <div className="tt-stats">{hover.stats}</div>
            <div className="tt-desc">{hover.desc}</div>
            {hover.tip && <div className="tt-tip">💡 {hover.tip}</div>}
          </div>
        )}
        <div className="row">{by(['1', '2', '3', '4', '5', '6', '7', '8', '9']).map((s) => btn(s, true))}</div>
        <div className="row">
          {PASSIVES.map((p) => (
            <button key={p.id} className="skill passive" onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}>
              <span className="icon">{p.icon}</span><span className="key">P</span>
            </button>
          ))}
          <div className="sep" />
          {by(['Q', 'W', 'E', 'R']).map((s) => btn(s))}
          <div className="sep" />
          {by(['D', 'F']).map((s) => btn(s))}
          <div className="sep" />
          {by(['A', 'T', 'G']).map((s) => btn(s))}
        </div>
        <div className="legend"><i className="k-action" />Action <i className="k-bonus" />Bonus Action <i className="k-free" />Free <i className="k-movement" />Movement <i className="k-passive" />Passive</div>
      </div>
    </div>
  )
}
