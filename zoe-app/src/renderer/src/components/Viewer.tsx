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
      case 'eg': return 'Erdgeschoss';
      case 'og1': return '1. Obergeschoss';
      case 'og2': return '2. Obergeschoss';
      case 'og3': return '3. Obergeschoss';
      case 'og4': return '4. Obergeschoss';
      default: return '';
    }
  })();

  const roomName = (() => {
    return selectedRoom ? (" - " + selectedRoom) : ' - ?'
  })();

  const src = (() => {
    try {
      // Vite: new URL resolves in both dev and production bundles
      return new URL(`../assets/floor-plans/${selectedId}.svg`, import.meta.url).href
    } catch {
      return undefined
    }
  })();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <label id='room'>{level}{roomName}</label>
      <div className='display-files'>
{/*       {src ? <img className='svg' src={src} alt={selectedId} /> : <div>Keine Pläne vorhanden</div>}
 */}      <PathFinder />
      </div>
    </div>
  )
}