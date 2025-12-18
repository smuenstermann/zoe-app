import React, { useCallback, useEffect } from 'react'
import findPath, { getNodes, getEdges, drawPath } from '@renderer/scripts/dijkstra'

// implement import of floor id so we know which nodes to fetch.
type Props = {
  selectedId?: string
  selectedRoom?: string
}

export default function Svg() {

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
        poly.setAttribute('stroke', 'red');
        poly.setAttribute('stroke-width', '8');
        poly.setAttribute('stroke-linecap', 'round');
        poly.setAttribute('stroke-linejoin', 'round');
        poly.setAttribute('pointer-events', 'none');

        svg.appendChild(poly);
    }}

    const handleRoomClick = useCallback<React.MouseEventHandler<SVGRectElement>>(async e => {
        document.querySelectorAll<SVGCircleElement>('circle').forEach(c => {
            c.setAttribute('visibility', 'hidden');
        });
        const room = e.currentTarget as SVGRectElement;
        console.log(`Room ${room.id} clicked`);
        const path = await findPath("202", room.id);
        try{
            console.log("Drawing path to: ", path[0])
            drawSVGPath(path)
        }
        catch(err){console.log("Failed to draw path", err)}

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
    }, [handleRoomClick]);

  return (
    <div>
      <svg id="floorplan" viewBox="0 0 800 900" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" aria-label="Grundriss 2. Obergeschoss">

      <g id="walls">
            <polygon
            id="polygon2941"
            points="10.38,11 10.38,757 439.08,757 439,360 744.8,360 744.8,11 623.5,11 623.5,37.5 436.57,37.5 436.57,11 317.1,11 317.1,37.5 129.2,37.5 129.2,11&#10;"
            fill="none"
            stroke-linejoin="round"
            stroke="black"
            stroke-width="2" />
        </g> 

        <g id="rooms" strokeWidth={1} stroke='#252525' fill='#f0d722'>
            <rect
                id="2th3"
                width="61.727619"
                height="25.614208"
                x="10.741018"
                y="11.495049"
                />
            <rect
                id="k2032"
                width="100.53455"
                height="92.654724"
                x="10.735133"
                y="35.997417" />
            <rect
                id="k2030"
                width="30.607744"
                height="48.168877"
                x="10.741869"
                y="129.51036" />
            <rect
                id="k2031"
                width="68.48674"
                height="48.173824"
                x="42.346962"
                y="129.50789" />
            <rect
                id="k2029"
                width="100.07687"
                height="93.205597"
                x="10.745737"
                y="178.09291" />
            <rect
                id="2wc1"
                width="40.31284"
                height="26.625748"
                x="10.739952"
                y="333.23465" />
            <rect
                id="2th1"
                width="57.847645"
                height="26.625748"
                x="51.828514"
                y="333.23465" />
            <rect
                id="k2019"
                width="99.016052"
                height="33.042095"
                x="10.730806"
                y="360.72711" />
            <rect
                id="k2t04"
                width="24.720766"
                height="20.790209"
                x="66.852692"
                y="311.69995" />
            <rect
                id="k2t03"
                width="17.173744"
                height="20.796928"
                x="92.433632"
                y="311.69659" />
            <rect
                id="k2018"
                width="99.003319"
                height="33.89632"
                x="10.740179"
                y="394.90356" />
            <rect
                id="k2017"
                width="99.03643"
                height="48.452499"
                x="10.740736"
                y="429.85049" />
            <rect
                id="k2016"
                width="99.033287"
                height="86.195747"
                x="10.742313"
                y="479.16846" />
            <rect
                id="k2015"
                width="63.631042"
                height="43.853828"
                x="46.218494"
                y="566.23035" />
            <rect
                id="k2014"
                width="34.933372"
                height="43.820251"
                x="10.752843"
                y="566.24713" />
            <rect
                width="99.200432"
                height="88.990677"
                x="10.740559"
                y="610.73248"
                id="k2013" />
            <rect
                id="k2012uh1"
                width="99.200432"
                height="29.360222"
                x="10.73739"
                y="699.948" />
            <rect
                id="2th2"
                width="76.811203"
                height="27.207964"
                x="31.189548"
                y="729.33014" />
            <rect
                id="k2012uh2"
                width="19.573004"
                height="27.207964"
                x="10.738472"
                y="729.33014"
                stroke="black" />
            <rect
                id="k2010"
                width="96.368507"
                height="122.16488"
                x="128.22604"
                y="634.33093" />
            <rect
                id="k2011"
                width="70.930328"
                height="43.618053"
                x="128.2309"
                y="713.48944" />
            <rect
                id="k2009"
                width="94.23317"
                height="122.15795"
                x="225.47331"
                y="634.33435" />
            <rect
                id="k2008"
                width="61.030334"
                height="37.755554"
                x="258.67053"
                y="718.87592" />
            <rect
                id="2dt1"
                width="191.41803"
                height="156.59294"
                x="128.2281"
                y="476.80499" />
            <rect
                id="k2024"
                width="49.013107"
                height="48.757183"
                x="270.43195"
                y="427.17093" />
            <rect
                id="k2025"
                width="49.013107"
                height="48.757183"
                x="220.34398"
                y="427.17093" />
            <rect
                id="k2026"
                width="42.374882"
                height="48.757183"
                x="177.53827"
                y="427.17093" />
            <rect
                id="k2027"
                width="48.194836"
                height="48.757183"
                x="128.31923"
                y="427.17093" />
            <rect
                id="k2028"
                width="21.711948"
                height="20.422127"
                x="164.23688"
                y="427.17093" />
            <rect
                id="k2020uh"
                width="105.87841"
                height="95.566399"
                x="128.32858"
                y="313.9678" />
            <rect
                id="k2022ud"
                width="83.530464"
                height="95.563133"
                x="234.95047"
                y="313.96884" />
            <rect
                id="k2033"
                width="47.298252"
                height="53.746033"
                x="128.64729"
                y="241.16403" />
            <rect
                id="k2034"
                width="45.725906"
                height="53.746033"
                x="177.36223"
                y="241.16403" />
            <rect
                id="k2035"
                width="93.455971"
                height="53.746033"
                x="224.48427"
                y="241.16403" />
            <rect
                id="2dt2"
                width="189.57021"
                height="202.5127"
                x="128.65387"
                y="37.991318" />
            <rect
                id="2th6"
                width="62.547859"
                height="25.794579"
                x="316.65463"
                y="11.499218" />
            <rect
                id="k2t06"
                width="56.322071"
                height="25.794579"
                x="379.85156"
                y="11.495049" />
            <rect
                id="k2038"
                width="98.849182"
                height="89.842087"
                x="334.55936"
                y="37.991318" />
            <rect
                id="k2039"
                width="29.686735"
                height="36.64727"
                x="403.87061"
                y="128.3849" />
            <rect
                id="k2040"
                width="68.751884"
                height="36.639786"
                x="334.55936"
                y="128.38864" />
            <rect
                id="k2041"
                width="99.021667"
                height="84.64151"
                x="334.47311"
                y="165.392" />
            <rect
                id="k2042"
                width="49.553219"
                height="44.769909"
                x="334.40073"
                y="250.18678" />
            <rect
                id="k2043"
                width="49.553219"
                height="44.769909"
                x="383.95441"
                y="250.18678" />
            <rect
                id="2dt3"
                width="190.84428"
                height="202.04099"
                x="433.96503"
                y="37.993965" />
            <rect
                id="k2044"
                width="98.768448"
                height="54.221081"
                x="434.0343"
                y="240.71242" />
            <rect
                id="k2045"
                width="22.845903"
                height="54.221081"
                x="533.38397"
                y="240.71242" />
            <rect
                id="k2046"
                width="22.845903"
                height="54.221081"
                x="557.09698"
                y="240.71242" />
            <rect
                id="k2047"
                width="43.822811"
                height="54.221081"
                x="580.81"
                y="240.71242" />
            <rect
                id="k2t07"
                width="56.322071"
                height="25.794579"
                x="687.2583"
                y="11.495049" />
            <rect
                id="k2048"
                width="100.8096"
                height="90.095398"
                x="643.48163"
                y="37.997131" />
            <rect
                id="k2049"
                width="100.80337"
                height="36.7925"
                x="643.48474"
                y="128.84085" />
            <rect
                id="k2050"
                width="100.8096"
                height="89.234055"
                x="643.48163"
                y="166.08627" />
            <rect
                id="k2051"
                width="100.79328"
                height="39.106068"
                x="643.48975"
                y="255.77831" />
            <rect
                id="2th7"
                width="75.96888"
                height="28.559889"
                x="628.23486"
                y="331.18298" />
            <rect
                id="k2t08"
                width="19.501753"
                height="14.420713"
                x="684.47845"
                y="316.88751" />
            <rect
                id="k2t09"
                width="19.501753"
                height="14.420713"
                x="664.71759"
                y="316.88751" />
            <rect
                id="k2pm2"
                width="19.501753"
                height="14.420713"
                x="644.65271"
                y="316.88751" />
            <rect
                id="k2053"
                width="62.724457"
                height="46.311913"
                x="565.3139"
                y="313.27628" />
            <rect
                id="k2054"
                width="30.876043"
                height="46.305237"
                x="533.69128"
                y="313.2796" />
            <rect
                id="k2055"
                width="94.98996"
                height="46.309837"
                x="437.61154"
                y="313.27731" />
            <rect
                id="k2pm1"
                width="22.229923"
                height="21.44043"
                x="414.82275"
                y="313.28024" />
            <rect
                id="k2kop1"
                width="15.99855"
                height="21.426428"
                x="398.71307"
                y="313.28326" />
            <rect
                id="k2t11"
                width="26.493055"
                height="21.434793"
                x="371.95575"
                y="313.27908" />
            <rect
                id="k2t12"
                width="35.867462"
                height="21.428488"
                x="335.8204"
                y="313.28226" />
            <rect
                id="2th4"
                width="61.76173"
                height="24.676294"
                x="335.81934"
                y="335.22562" />
            <rect
                id="k2fs1"
                width="15.932307"
                height="24.683132"
                x="397.85886"
                y="335.2222" />
            <rect
                id="k2fs2"
                width="15.932307"
                height="24.666346"
                x="413.90707"
                y="335.23059" />
            <rect
                id="0001"
                width="7.828392"
                height="24.719004"
                x="429.85764"
                y="335.20425" />
            <rect
                id="k2001"
                width="102.65809"
                height="99.714516"
                x="335.83005"
                y="360.20142" />
            <rect
                id="2la"
                width="44.198139"
                height="37.865097"
                x="394.44073"
                y="421.91956" />
            <rect
                id="k2t01"
                width="67.614388"
                height="17.805779"
                x="335.75433"
                y="459.99017" />
            <rect
                id="k2t02"
                width="34.67263"
                height="18.036934"
                x="403.51227"
                y="459.87457" />
            <rect
                id="k2003"
                width="102.66295"
                height="88.036697"
                x="335.81955"
                y="477.8486" />
            <rect
                id="k2004"
                width="34.325924"
                height="44.095757"
                x="404.16388"
                y="566.4682" />
            <rect
                id="k2005"
                width="67.614388"
                height="44.106918"
                x="335.82526"
                y="566.46259" />
            <rect
                id="k2006"
                width="102.65949"
                height="88.650528"
                x="335.82126"
                y="611.00348" />
            <rect
                id="k2007ud1"
                width="102.61812"
                height="29.978001"
                x="335.84195"
                y="699.92719" />
            <rect
                id="0002"
                width="20.492819"
                height="26.332188"
                x="398.98782"
                y="730.18378" />
            <rect
                id="k2007ud2"
                width="18.972754"
                height="26.332188"
                x="419.66071"
                y="730.18378" />
            <rect
                id="2th5"
                width="59.678699"
                height="26.332188"
                x="339.121"
                y="730.18378" />
            <rect
                id="2wc5"
                width="19.950592"
                height="42.826904"
                x="724.44092"
                y="316.88376" />
            <rect
                id="wc"
                width="19.413382"
                height="42.821442"
                x="704.55621"
                y="316.88647" />
            <rect
                id="2th8"
                width="62.556194"
                height="25.794579"
                x="624.05719"
                y="11.495049" />
        </g>
        
        <g id="labels" fontFamily="Arial" fontSize="12" fill="#252525" visibility="visible">
            <text x="20" y="30">2th3</text>
            <text x="20" y="60">K2032</text>
            <text x="15" y="150">K2030</text>
            <text x="70" y="150">K2031</text>
            <text x="20" y="220">K2029</text>
            <text x="20" y="360">2wc1</text>
            <text x="60" y="360">2th1</text>
            <text x="20" y="390">K2019</text>
            <text x="70" y="330">K2t04</text>
            <text x="95" y="330">K2t03</text>
            <text x="20" y="425">K2018</text>
            <text x="20" y="460">K2017</text>
            <text x="20" y="520">K2016</text>
            <text x="50" y="580">K2015</text>
            <text x="15" y="580">K2014</text>
            <text x="20" y="650">K2013</text>
            <text x="20" y="720">K2012uh1</text>
            <text x="35" y="750">2th2</text>
            <text x="15" y="750">K2012uh2</text>
            <text x="130" y="700">K2010</text>
            <text x="130" y="740">K2011</text>
            <text x="230" y="700">K2009</text>
            <text x="260" y="750">K2008</text>
            <text x="140" y="550">2dt1</text>
            <text x="280" y="450">K2024</text>
            <text x="230" y="450">K2025</text>
            <text x="180" y="450">K2026</text>
            <text x="130" y="450">K2027</text>
            <text x="170" y="440">K2028</text>
            <text x="130" y="350">K2020uh</text>
            <text x="240" y="350">K2022ud</text>
            <text x="130" y="270">K2033</text>
            <text x="180" y="270">K2034</text>
            <text x="230" y="270">K2035</text>
            <text x="140" y="150">2dt2</text>
            <text x="320" y="30">2th6</text>
            <text x="390" y="30">K2t06</text>
            <text x="350" y="80">K2038</text>
            <text x="410" y="130">K2039</text>
            <text x="340" y="130">K2040</text>
            <text x="340" y="200">K2041</text>
            <text x="340" y="270">K2042</text>
            <text x="390" y="270">K2043</text>
            <text x="450" y="150">2dt3</text>
            <text x="440" y="260">K2044</text>
            <text x="540" y="260">K2045</text>
            <text x="560" y="260">K2046</text>
            <text x="590" y="260">K2047</text>
            <text x="690" y="30">K2t07</text>
            <text x="650" y="80">K2048</text>
            <text x="650" y="130">K2049</text>
            <text x="650" y="200">K2050</text>
            <text x="650" y="270">K2051</text>
            <text x="630" y="350">2th7</text>
            <text x="680" y="320">K2t08</text>
            <text x="660" y="320">K2t09</text>
            <text x="645" y="320">K2pm2</text>
            <text x="570" y="340">K2053</text>
            <text x="540" y="340">K2054</text>
            <text x="440" y="340">K2055</text>
            <text x="420" y="340">K2pm1</text>
            <text x="400" y="340">K2kop1</text>
            <text x="370" y="340">K2t11</text>
            <text x="340" y="340">K2t12</text>
            <text x="340" y="360">2th4</text>
            <text x="400" y="360">K2fs1</text>
            <text x="415" y="360">K2fs2</text>
            <text x="435" y="360">0001</text>
            <text x="340" y="400">K2001</text>
            <text x="400" y="440">2la</text>
            <text x="350" y="470">K2t01</text>
            <text x="410" y="470">K2t02</text>
            <text x="340" y="510">K2003</text>
            <text x="410" y="590">K2004</text>
            <text x="350" y="590">K2005</text>
            <text x="340" y="650">K2006</text>
            <text x="340" y="710">K2007ud1</text>
            <text x="400" y="740">0002</text>
            <text x="420" y="740">K2007ud2</text>
            <text x="350" y="740">2th5</text>
            <text x="725" y="340">2wc5</text>
            <text x="705" y="340">wc</text>
            <text x="630" y="30">2th8</text>
        </g>

        <g id="nodes" visibility="hidden">
            <circle
                id="n201"
                cy="304.12326"
                cx="43.716148"
                ry="2"
                rx="2" />
            <circle
                id="n202"
                cy="304.12"
                cx="80.5"
                r="2" />
            <circle
                id="n203"
                cy="304.12"
                cx="102.25"
                r="2" />
            <circle
                id="n204"
                cy="304.12"
                cx="119.5"
                r="2" />
            <circle
                id="n205"
                cy="194.62326"
                cx="119.5"
                r="2" />
            <circle
                id="n206"
                cy="48.87"
                cx="119.5"
                r="2" />
            <circle
                id="n207"
                cy="29.87"
                cx="119.5"
                r="2" />
            <circle
                id="n208"
                cy="29.87"
                cx="76.5"
                r="2" />
            <circle
                id="n210"
                cy="377.87"
                cx="119.5"
                r="2" />
            <circle
                id="n211"
                cy="417.87"
                cx="119.5"
                r="2" />
            <circle
                id="n212"
                cy="456.37"
                cx="119.5"
                r="2" />
            <circle
                id="n213"
                cy="551.37"
                cx="119.5"
                r="2" />
            <circle
                id="n214"
                cy="623.87"
                cx="119.5"
                r="2" />
            <circle
                id="n215"
                cy="684.12"
                cx="119.5"
                r="2" />
            <circle
                id="n216"
                cy="721.87"
                cx="119.5"
                r="2" />
            <circle
                id="n217"
                cy="744.37"
                cx="119.5"
                r="2" />
            <circle
                id="n218"
                cy="304.12"
                cx="153.08"
                r="2" />
            <circle
                id="n219"
                cy="304.12"
                cx="294.33"
                r="2" />
            <circle
                id="n220"
                cy="304.12"
                cx="326.08"
                r="2" />
            <circle
                id="n221"
                cy="185.32"
                cx="326.08"
                r="2" />
            <circle
                id="n222"
                cy="52.393238"
                cx="326.08"
                r="2" />
            <circle
                id="n223"
                cy="417.87"
                cx="155.56"
                r="2" />
            <circle
                id="n224"
                cy="417.87"
                cx="196.57"
                r="2" />
            <circle
                id="n225"
                cy="417.87"
                cx="246.42"
                r="2" />
            <circle
                id="n226"
                cy="417.87"
                cx="295.21"
                r="2" />
            <circle
                id="n227"
                cy="417.87"
                cx="326.08"
                r="2" />
            <circle
                id="n228"
                cy="416.90"
                cx="362.85"
                r="2" />
            <circle
                id="n229"
                cy="370.94"
                cx="362.85"
                r="2" />
            <circle
                id="n230"
                cy="370.94"
                cx="405.63"
                r="2" />
            <circle
                id="n231"
                cy="370.94"
                cx="422.60"
                r="2" />
            <circle
                id="n232"
                cy="442.00"
                cx="388.31"
                r="2" />
            <circle
                id="n233"
                cy="470.64"
                cx="326.08"
                r="2" />
            <circle
                id="n234"
                cy="503.52"
                cx="326.08"
                r="2" />
            <circle
                id="n235"
                cy="647.77"
                cx="326.08"
                r="2" />
            <circle
                id="n236"
                cy="713.89"
                cx="326.08"
                r="2" />
            <circle
                id="n237"
                cy="746.06"
                cx="326.08"
                r="2" />
            <circle
                id="n238"
                cy="304.12"
                cx="357.20"
                r="2" />
            <circle
                id="n239"
                cy="304.12"
                cx="383.71"
                r="2" />
            <circle
                id="n240"
                cy="304.12"
                cx="407.05"
                r="2" />
            <circle
                id="n241"
                cy="304.12"
                cx="425.08"
                r="2" />
            <circle
                id="n242"
                cy="304.12"
                cx="484.47"
                r="2" />
            <circle
                id="n243"
                cy="304.12"
                cx="546.70"
                r="2" />
            <circle
                id="n244"
                cy="304.12"
                cx="570.39"
                r="2" />
            <circle
                id="n245"
                cy="304.12"
                cx="602.91"
                r="2" />
            <circle
                id="n246"
                cy="304.12"
                cx="634.73"
                r="2" />
            <circle
                id="n247"
                cy="274.07"
                cx="634.73"
                r="2" />
            <circle
                id="n248"
                cy="191.33"
                cx="634.73"
                r="2" />
            <circle
                id="n249"
                cy="148.55"
                cx="634.73"
                r="2" />
            <circle
                id="n250"
                cy="111.08"
                cx="634.73"
                r="2" />
            <circle
                id="n251"
                cy="46.73"
                cx="634.73"
                r="2" />
            <circle
                id="n252"
                cy="304.12"
                cx="653.47"
                r="2" />
            <circle
                id="n253"
                cy="304.12"
                cx="674.69"
                r="2" />
            <circle
                id="n254"
                cy="304.12"
                cx="693.78"
                r="2" />
            <circle
                id="n255"
                cy="304.12"
                cx="713.58"
                r="2" />
            <circle
                id="n256"
                cy="304.12"
                cx="733.73"
                r="2" />
            <circle
                id="n257"
                cy="732"
                cx="119.5"
                r="2" />
            <circle
                id="n258"
                cy="194.62"
                cx="119.5"
                r="2" />
            <circle
                id="n259"
                cy="194.62"
                cx="119.5"
                r="2" />
            <circle
                id="n260"
                cy="185.32"
                cx="326.08"
                r="2" />
            <circle
                id="n261"
                cy="185.32"
                cx="326.08"
                r="2" />
            <circle
                id="n262"
                cy="52"
                cx="326.08"
                r="2" />
            <circle
                id="n263"
                cy="111.08"
                cx="634.73"
                r="2" />
            <circle
                id="n264"
                cy="304.12"
                cx="602.91"
                r="2" />
            <circle
                id="n265"
                cy="304.12"
                cx="546.70"
                r="2" />
            <circle
                id="n266"
                cy="304.12"
                cx="484.47"
                r="2" />
            <circle
                id="n267"
                cy="304.12"
                cx="407.05"
                r="2" />
            <circle
                id="n268"
                cy="304.12"
                cx="357.20"
                r="2" />
            <circle
                id="n269"
                cy="746.06"
                cx="326.08"
                r="2" />
            <circle
                id="n270"
                cy="689.39001"
                cx="326.07999"
                r="2" />
            <circle
                id="n271"
                cy="370.94"
                cx="422.60"
                r="2" />
            <circle
                id="n272"
                cy="304.12"
                cx="153.08"
                r="2" />
            <circle
                id="n273"
                cy="304.12"
                cx="153.08"
                r="2" />
            <circle
                id="n274"
                cy="304.12"
                cx="294.33"
                r="2" />
            <circle
                id="n275"
                cy="304.12"
                cx="294.33"
                r="2" />
            <circle
                id="n276"
                cy="417.87"
                cx="175"
                r="2" />
            <circle
                id="n277"
                cy="470.64"
                cx="326.08"
                r="2" />
            <circle
                id="n278"
                cy="503.52"
                cx="326.08"
                r="2" />
            <circle
                id="n279"
                cy="503.52"
                cx="326.08"
                r="2" />
        </g>

        </svg>
    </div>
  )
}
