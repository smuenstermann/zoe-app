import '../assets/viewer.css'
import PathFinder from './PathFinder';

type Props = {
  selectedId?: string
  selectedRoom?: string
}

export default function Viewer({ selectedId, selectedRoom }: Props) {

  const level = (() => {
    switch (selectedId) {
      case 'building': return 'Gebäude';
      case '0eg': return 'Erdgeschoss';
      case '1og': return '1. Obergeschoss';
      case '2og': return '2. Obergeschoss';
      case '3og': return '3. Obergeschoss';
      case '4og': return '4. Obergeschoss';
      default: return '';
    }
  })();

  const roomName = (() => {
    return selectedRoom&&(selectedRoom != ' ') ? ("Raum: " + selectedRoom) : ' '
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid var(--ev-c-border-1)'}}>
        <label id='level'>{level}</label>
        <label id='room'>{roomName}</label>
      </div>
      <div className='display-files'>
        <PathFinder selectedId={selectedId} selectedRoom={selectedRoom} />
      </div>
    </div>
  )
}