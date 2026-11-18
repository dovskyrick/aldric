import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import battle from '../../03-level-6-battle-paths.md?raw'
import workflows from '../../01-paladin-turn-workflows.md?raw'
import steed from '../../04-faithful-steed-guide.md?raw'
import level6 from '../../02-level-5-to-6-changes.md?raw'
import audit from '../../06-level-6-audit.md?raw'

const TABS = [
  { id: 'battle', label: 'Battle Paths (Lv 6)', md: battle },
  { id: 'workflows', label: 'Turn Workflows', md: workflows },
  { id: 'steed', label: 'Steed & Mounting', md: steed },
  { id: 'level6', label: 'Level 5 → 6', md: level6 },
  { id: 'audit', label: 'Rules Audit', md: audit },
]

export default function Help({ onClose }) {
  const [tab, setTab] = useState(() => {
    try { return localStorage.getItem('helpTab') || 'battle' } catch { return 'battle' }
  })
  const html = useMemo(() => marked.parse(TABS.find((t) => t.id === tab)?.md || ''), [tab])

  useEffect(() => {
    try { localStorage.setItem('helpTab', tab) } catch { /* storage unavailable */ }
    document.querySelector('.help-body')?.scrollTo(0, 0)
  }, [tab])

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help" onClick={(e) => e.stopPropagation()}>
        <div className="help-head">
          <div className="help-tabs">
            {TABS.map((t) => (
              <button key={t.id} className={t.id === tab ? 'on' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
          <button className="help-close" onClick={onClose}>← Back to game (H / Esc)</button>
        </div>
        <div className="help-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}
