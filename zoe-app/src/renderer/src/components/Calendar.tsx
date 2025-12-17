import '../assets/calendar.css'
import { useEffect, useState } from 'react'

export default function Calendar() {
      //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
      
      // examplary usage for calendar
    type EventItem = {
      date: string
      time: string
      title: string
      description: string
      room: string
    }


  const [events, setEvents] = useState<EventItem[]>([])

    function startOfWeek(date: Date) {
      // Monday as first day of week
      const d = new Date(date)
      const dayIndex = (d.getDay() + 6) % 7 // Monday=0 .. Sunday=6
      d.setDate(d.getDate() - dayIndex)
      d.setHours(0, 0, 0, 0)
      return d
    }

    useEffect(() => {
      ;(async () => {
        try {
          // ask main process for events
          const rows = await (window as any).electron.ipcRenderer.invoke('db/getEvents')

          if (!Array.isArray(rows)) return

          // Debug: log raw rows and event_start types to diagnose timezone/parsing issues
          try {
            console.log('Raw events from main:', rows)
            ;(rows as any[]).forEach((r: any, idx: number) => {
              try {
                console.log(`row ${idx} event_start:`, r.event_start, 'type:', typeof r.event_start, 'asISO:', r.event_start && (r.event_start instanceof Date ? r.event_start.toISOString() : String(r.event_start)))
              } catch (err) {
                console.log('row parse error', err)
              }
            })
          } catch (err) {
            console.log('Failed to log raw events', err)
          }

          const now = new Date()
          const start = startOfWeek(now)
          const end = new Date(start)
          end.setDate(start.getDate() + 7) // exclusive

          const mapped: EventItem[] = rows
            .map((r: any) => {
              // DB returns event_start (string or Date) and t_rooms.name as `name`
              const startTs = r.event_start ? new Date(r.event_start) : null
              return {
                __rawStart: startTs,
                date: startTs ? startTs.toLocaleDateString() : '',
                time: startTs ? startTs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                title: r.title || r.name || r.room_name || '',
                description: r.description || '',
                room: r.name || r.room || ''
              }
            })
            .filter((ev: any) => {
              if (!ev.__rawStart) return false
              return ev.__rawStart >= start && ev.__rawStart < end
            })
            // remove helper field
            .map((ev: any) => ({ date: ev.date, time: ev.time, title: ev.title, description: ev.description, room: ev.room }))

          setEvents(mapped)
        } catch (err) {
          console.error('Failed to load events', err)
        }
      })()
    }, [])

    return (
      <div className='wrapper'>
        <h2>Veranstaltungen</h2>
        <div className='calendar'>
          <div className='headings'>
            <p>Zeit</p>
            <p>Veranstaltung</p>
            <p>Beschreibung</p>
            <p>Raum</p>
          </div>

          <div className='event-content'>
              {events.length === 0 ? (
                <div className='rows'>
                  <p></p>
                  <p>Keine Veranstaltungen</p>
                  <p></p>
                  <p></p>
                </div>
              ) : (
                events.map((ev, idx) => (
                  <div className='rows' key={`${ev.date}-${ev.time}-${ev.title}-${idx}`}>
                    <p>
                      {ev.date}
                      <br />
                      {ev.time} Uhr
                    </p>
                    <p>{ev.title}</p>
                    <p>{ev.description}</p>
                    <p>{ev.room}</p>
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
    )
}
