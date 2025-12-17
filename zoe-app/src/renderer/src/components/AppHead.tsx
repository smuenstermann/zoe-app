import React from 'react'
import logo from '../assets/logo_ZOE.svg'
import logo2 from '../assets/logo_ZOE2.svg'
import logo_bvg from '../assets/logo-bvg.svg'

var srcZOE = logo
var srcZOE2 = logo2
var srcBVG = logo_bvg


export default function appHead() {
  return (
    <div className="app-head">
      <div className='d'></div>
      <img className='logo' src={srcZOE2} alt="Logo Zentrale OrientierungsEinheit" />
      <img className='logo-bvg' src={srcBVG} alt="Logo BVG Herz" />
    </div>
  )
}
