import React from 'react'
import '../assets/keyboard.css'

type Props = {
  onKey: (key: string) => void
  onEnter?: () => void
  onBackspace?: () => void
  onClose?: () => void
}

const ROWS: string[][] = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['Q','W','E','R','T','Z','U','I','O','P','Ü'],
  ['A','S','D','F','G','H','J','K','L','Ö','Ä'],
  ['Y','X','C','V','B','N','M',',','.','-']
]

export default function VirtualKeyboard({ onKey, onEnter, onBackspace, onClose }: Props) {
  const style: React.CSSProperties = { position: 'fixed', left: '50%', top: '60%', transform: 'translate(-50%, -50%)' }

  return (
    <div className="virtual-keyboard" style={style} onMouseDown={(e) => e.preventDefault()} onPointerDown={(e) => e.preventDefault()}>
      <div className="vk-header">
        <button className="close-button" type="button" aria-label="Close keyboard" onMouseDown={(e) => e.preventDefault()} onPointerDown={(e) => e.preventDefault()} onClick={() => onClose?.()}>✕</button>
      </div>

      {ROWS.map((row, i) => (
        <div key={i} className="vk-row">
          {row.map(k => (
            <button key={k} type="button" className="vk-key" onMouseDown={(e) => e.preventDefault()} onPointerDown={(e) => e.preventDefault()} onClick={() => onKey(k)}>{k}</button>
          ))}
        </div>
      ))}

      <div className='vk-bottom-row'>
        <button type="button" className="vk-key" onMouseDown={(e) => e.preventDefault()} onPointerDown={(e) => e.preventDefault()} onClick={() => onKey(' ')}>Space</button>
        <button type="button" className="vk-key" onMouseDown={(e) => e.preventDefault()} onPointerDown={(e) => e.preventDefault()} onClick={() => onBackspace?.()}>⌫</button>
        <button type="button" className="vk-key" onMouseDown={(e) => e.preventDefault()} onPointerDown={(e) => e.preventDefault()} onClick={() => onEnter?.()}>Enter</button>
      </div>
    </div>
  )
}