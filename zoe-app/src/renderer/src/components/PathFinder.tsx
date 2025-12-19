import React, { useCallback, useEffect } from 'react'
import findPath from '@renderer/scripts/dijkstra'
import SVG2og from './SVG2og'
import SVGeg from './SVGeg'
import SVG1og from './SVG1og'
import SVG3og from './SVG3og'
import SVG4og from './SVG4og'

// Props: accept both `selected` (legacy) and `selectedId` variants plus selectedRoom
type Props = {
    selected?: string
    selectedId?: string
    selectedRoom?: string
}

export default function Svg({ selected, selectedId, selectedRoom }: Props) {

    // derive canonical floor id from props (order: selectedId, selected, fallback '2og')
    const floorId = selectedId ?? selected ?? '2og'
    console.log("Rendering floorId: ", floorId)

    function switchFloor(floorId: string){


    }

    function drawSVGPath(path: any[]){ {

        if (!path || path.length === 0) return;

        const svg = document.getElementById('floorplan') as SVGSVGElement | null;
        if (!svg) return;

        const pts = path.map(n => {
            return `${Number((n as any).pos_x)},${Number((n as any).pos_y)}`
        }).join(' ')

        console.log("SVG Points: ", pts)

        const existing = svg.querySelector<SVGElement>('#route-line');
        if (existing) existing.remove();
        
        const ns = 'http://www.w3.org/2000/svg';
        const poly = document.createElementNS(ns, 'polyline');
        poly.setAttribute('id', 'route-line');
        poly.setAttribute('points', pts);
        poly.setAttribute('fill', 'none');
        poly.setAttribute('stroke', '#f0d722');
        poly.setAttribute('stroke-width', '10');
        poly.setAttribute('stroke-dasharray', '1,26');
        poly.setAttribute('stroke-linecap', 'round');
        poly.setAttribute('stroke-linejoin', 'round');
        poly.setAttribute('pointer-events', 'none');

        svg.appendChild(poly);
    }}

    function markTargetRoom(roomId: string){ {
        document.querySelectorAll<SVGCircleElement>('circle').forEach(c => {
            c.setAttribute('visibility', 'hidden');
        });
        document.querySelectorAll<SVGRectElement>('#rooms rect').forEach(r => {
            r.style.fill = '#fff6aeff';
        });
        document.querySelectorAll<SVGElement>('#labels text').forEach(t => {
            t.setAttribute('visibility', 'hidden');
        });

        const room = document.getElementById(roomId) as SVGRectElement | null;
        if (!room) {
            console.warn(`Room element with id "${roomId}" not found`);
            return;
        }
        room.style.fill = '#f0d722';
        // Use an attribute selector (or getElementById) because IDs that start with
        // a digit are not valid unescaped CSS identifiers. Attribute selector
        // works reliably for all ID values.
        const label = document.querySelector<SVGElement>(`#labels text[id="${room.id}"]`)
            ?? document.getElementById(room.id) as SVGElement | null;
        label?.setAttribute('visibility', 'visible');
        console.log('Text label selector used for id:', room.id);
        //console.log(`Room ${room.id} clicked`);
    }}

    const handleRoomClick = useCallback<React.MouseEventHandler<SVGRectElement>>(async e => {
        const room = e.currentTarget as SVGRectElement;    
        const path = await findPath("202", room.id);
        try{
            console.log("Drawing path to: ", path[0])
            drawSVGPath(path)
        }
        catch(err){console.log("Failed to draw path", err)}

        markTargetRoom(room.id);

    }, []);

    useEffect(() => {
        // run after the component mounts so the elements exist in the DOM
        const rects = Array.from(document.querySelectorAll<SVGRectElement>('#rooms rect'));
        rects.forEach(r => {
            r.style.cursor = 'pointer';
            const handler = (e: MouseEvent) =>
                handleRoomClick(e as unknown as React.MouseEvent<SVGRectElement>);
            (r as any).__roomClickHandler = handler;
            r.addEventListener('click', handler);
        });
        return () => {
            rects.forEach(r => {
                const h = (r as any).__roomClickHandler;
                if (h) r.removeEventListener('click', h);
                delete (r as any).__roomClickHandler;
            });
        };
    }, [handleRoomClick, floorId]);

    return (
        <>
            {floorId === '0eg' && <SVGeg key="0eg" />}
            {floorId === '1og' && <SVG1og key="1og" />}
            {floorId === '2og' && <SVG2og key="2og" />}
            {floorId === '3og' && <SVG3og key="3og" />}
            {floorId === '4og' && <SVG4og key="4og" />}
        </>
    )
}
