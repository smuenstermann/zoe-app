import React, { useCallback, useState, useEffect, useRef } from 'react'
import VirtualKeyboard from './VirtualKeyboard'
import '../assets/tabs.css'
import findPath from '@renderer/scripts/dijkstra'
import { drawPath } from '@renderer/scripts/dijkstra'


type Props = {
  onSelectedTab?: (tabId: string) => void
  onSelectedRoom?: (roomName: string) => void
}

export default function Tabs({ onSelectedTab, onSelectedRoom }: Props) {
  // stable handler so children don't recreate callbacks on every render
  const handleTabClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(e => {
    const tabId = (e.currentTarget as HTMLButtonElement).id
    // defensive: ensure ipcRenderer exists on the preload bridge
    if (window?.electron?.ipcRenderer?.send) {
      window.electron.ipcRenderer.send('tab-clicked', tabId)
    }
    onSelectedTab?.(tabId)
  }, [onSelectedTab])

  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showKeyboard, setShowKeyboard] = useState(false)

  const selectRoom = useCallback((match: string) => {
    onSelectedRoom?.(match)
    const up = match.toUpperCase()
    if (up.startsWith('LE') || up.startsWith('KE')) onSelectedTab?.('0eg')
    else if (up.startsWith('K1') || up.startsWith('L1')) onSelectedTab?.('1og')
    else if (up.startsWith('K2')) onSelectedTab?.('2og')
    else if (up.startsWith('K3')) onSelectedTab?.('3og')
    else if (up.startsWith('K4')) onSelectedTab?.('4og')
    setText('')
    setSuggestions([])
    try { inputRef.current?.blur() } catch (err) {  }
    try { setShowKeyboard(false) } catch (err) {  }
  }, [onSelectedRoom, onSelectedTab])

  const hideKeyboardAndBlur = useCallback(() => {
    try { inputRef.current?.blur() } catch (err) {  }
    try { setShowKeyboard(false) } catch (err) {  }
  }, [])

  const handleSearchSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return

    const exact = suggestions.find(s => s.toLowerCase() === value.toLowerCase())
    if (exact) {
      selectRoom(exact)
    } else {
      const input = e.currentTarget.querySelector('input[name="text"]') as HTMLInputElement | null
      if (input) {
        input.classList.add('invalid')
        setTimeout(() => input.classList.remove('invalid'), 900)
      }
    }

    // always blur the input and hide the in-app keyboard after Enter
    hideKeyboardAndBlur()
  }, [text, suggestions, selectRoom, hideKeyboardAndBlur])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!text) {
      setSuggestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = window.setTimeout(async () => {
      try {
        const prefix = text.trim()
        const resp = await window?.electron?.ipcRenderer?.invoke?.('db/searchRooms', prefix)
        if (Array.isArray(resp)) {
          const names = resp.map((r: any) => r.name).filter(Boolean)
          setSuggestions(names)
        } else {
          setSuggestions([])
        }
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [text])

  // Hide suggestions and virtual keyboard when clicking outside or pressing Escape
  useEffect(() => {
    function onDocPointer(e: MouseEvent | TouchEvent) {
      const target = (e as MouseEvent).target as Node | null
      if (!wrapperRef.current) return
      if (!target || !wrapperRef.current.contains(target)) {
        setSuggestions([])
        try { setShowKeyboard(false) } catch (err) {  }
      }
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSuggestions([])
        try { inputRef.current?.blur() } catch (err) {  }
        try { setShowKeyboard(false) } catch (err) {  }
      }
    }

    document.addEventListener('mousedown', onDocPointer)
    document.addEventListener('touchstart', onDocPointer)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocPointer)
      document.removeEventListener('touchstart', onDocPointer)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  return (
    <div className='tabs-container'>
      <form className='search-form' onSubmit={handleSearchSubmit}>
        <div ref={wrapperRef} className='search-container' style={{ 
              position: 'relative', 
              width: '100%', 
              color: 'black', 
              alignItems: 'center', 
              justifyContent: 'center'
              }}>
          <input
            ref={inputRef}
            name="text"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            onFocus={() => { try { setShowKeyboard(true) } catch (err) { /* ignore */ } }}
            onBlur={(e) => {
              // keep keyboard open if focus moves to something inside the wrapper (e.g. suggestion or keyboard)
              const related = (e.relatedTarget || (e.nativeEvent as any).relatedTarget) as Node | null
              if (!wrapperRef.current || !related || !wrapperRef.current.contains(related)) {
                try { inputRef.current?.blur() } catch (err) { /* ignore */ }
                try { setShowKeyboard(false) } catch (err) { /* ignore */ }
                setSuggestions([])
              }
            }}
            type="text"
            placeholder="Suchen..."
            autoComplete="off"
            style={{background: 'var(--ev-c-text-3)'}}
          />
          {loading && <div style={{ position: 'absolute', right: 8, top: 8 }}>…</div>}
          {suggestions.length > 0 && (
            <ul className="search-suggestions">
              {suggestions.map(s => (
                <li key={s} style={{ padding: '6px 8px', cursor: 'pointer' }} onMouseDown={(ev) => { ev.preventDefault(); selectRoom(s) }}>{s}</li>
              ))}
            </ul>
          )}
          {showKeyboard && (
            <VirtualKeyboard
              onKey={(k) => { setText(t => t + k); try { inputRef.current?.focus() } catch (e) {} }}
              onBackspace={() => setText(t => t.slice(0, -1))}
              onEnter={() => {
                const exact = suggestions.find(s => s.toLowerCase() === text.trim().toLowerCase())
                if (exact) selectRoom(exact)
                try { inputRef.current?.blur() } catch (e) {}
                setShowKeyboard(false)
              }}
              onClose={() => { setShowKeyboard(false); try { inputRef.current?.blur() } catch (e) {} }}
            />
          )}
        <button type="submit" style={{paddingInline: 16}}>&#x1F50E;&#xFE0E;</button>
        </div>
      </form>
      <div className='tab-items'>
        <button className='tab-button' id='building' onClick={handleTabClick}>Gebäude</button>
        <button className='tab-button' id='0eg' onClick={handleTabClick}>EG</button>
        <button className='tab-button' id='1og' onClick={handleTabClick}>1. OG</button>
        <button className='tab-button' id='2og' onClick={handleTabClick}>2. OG</button>
        <button className='tab-button' id='3og' onClick={handleTabClick}>3. OG</button>
        <button className='tab-button' id='4og' onClick={handleTabClick}>4. OG</button>
      </div>
    </div>
  )
}