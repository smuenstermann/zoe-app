// @ts-ignore: SVG module declaration missing in project; treat as string
import React, {useState} from 'react'
import Calendar from './components/Calendar'
import AppHead from './components/AppHead'
import Tabs from './components/Tabs'
import Viewer from './components/Viewer'
import Dijkstra from './scripts/dijkstra'

function App(): React.JSX.Element {
  const [selected, setSelected] = React.useState<string>('eg');
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);

  return (
    <>

      <AppHead></AppHead>
      <div className="content-container">
        <div className='tabs-container'>
          <Tabs onSelectedTab={setSelected} onSelectedRoom={setSelectedRoom}></Tabs>
        </div>
        <div className="viewer-container">
          <Viewer selectedId={selected} selectedRoom={selectedRoom}></Viewer>
        </div>
        <div className="calendar-container">
          <Calendar></Calendar>
        </div>
      </div>
    </>
  )
}

export default App
