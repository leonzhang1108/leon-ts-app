import React from 'react'
import './index.less'

console.log('source: https://codepen.io/kevinjannis/pen/pFAwB')

const Boulder = () => (
  <div className="boulder-badge badge-wrapper">
    <div className="badge">
      <div className="part part-1" />
      <div className="part part-2" />
      <div className="part part-3" />
      <div className="part part-4" />
      <div className="part part-shade" />
    </div>
  </div>
)

const Cascade = () => (
  <div className="cascade-badge badge-wrapper">
    <div className="badge">
      <div className="part part-1" />
      <div className="part part-2" />
      <div className="part part-3" />
      <div className="part part-4" />
      <div className="part part-5" />
      <div className="part part-6" />
      <div className="part part-7" />
      <div className="part part-8" />
    </div>
  </div>
)

const Thunder = () => (
  <div className="thunder-badge badge-wrapper">
    <div className="badge">
      <div className="part part-1" />
      <div className="part part-2" />
      <div className="part part-3" />
      <div className="part part-4" />
      <div className="part part-shade" />
    </div>
  </div>
)

const Rainbow = () => (
  <div className="rainbow-badge badge-wrapper">
    <div className="badge">
      <div className="part-leaf part-1" />
      <div className="part-leaf part-2" />
      <div className="part-leaf part-3" />
      <div className="part-leaf part-4" />
      <div className="part-leaf part-5" />
      <div className="part-leaf part-6" />
      <div className="part-leaf part-7" />
      <div className="part-leaf part-8" />
      <div className="part-inner part-1" />
      <div className="part-inner part-2" />
      <div className="part-inner part-3" />
      <div className="part-inner part-4" />
    </div>
  </div>
)

const Soul = () => (
  <div className="soul-badge badge-wrapper">
    <div className="badge">
      <div className="part part-1" />
      <div className="part part-2" />
      <div className="part part-3" />
      <div className="part part-4" />
      <div className="part part-5" />
      <div className="part part-6" />
      <div className="part part-7" />
      <div className="part part-8" />
      <div className="part part-9" />
      <div className="part part-10" />
      <div className="part part-shade" />
    </div>
  </div>
)

const Marsh = () => (
  <div className="marsh-badge badge-wrapper">
    <div className="badge">
      <div className="inner" />
    </div>
  </div>
)

const Volcano = () => (
  <div className="volcano-badge badge-wrapper">
    <div className="badge">
      <div className="part-outer part-1" />
      <div className="part-outer part-2" />
      <div className="part-outer part-3" />
      <div className="part-outer part-4" />
      <div className="part-outer part-5" />
      <div className="part-outer part-6" />
      <div className="part-outer part-7" />
      <div className="part-outer part-8" />
      <div className="part-outer part-9" />
      <div className="part-outer part-10" />
      <div className="part-inner part-1" />
      <div className="part-inner part-2" />
      <div className="part-inner part-3" />
      <div className="part-inner part-4" />
      <div className="part-inner part-5" />
      <div className="part-inner part-6" />
      <div className="part-inner part-7" />
      <div className="part-inner part-8" />
      <div className="part-inner part-9" />
      <div className="part-inner part-10" />
    </div>
  </div>
)

const Earth = () => (
  <div className="earth-badge badge-wrapper">
    <div className="badge">
      <div className="part-leaf part-top" />
      <div className="part-leaf part-1" />
      <div className="part-leaf part-2" />
      <div className="part-leaf part-3" />
      <div className="part-leaf part-4" />
      <div className="part-leaf part-5" />
      <div className="part-leaf part-6" />
      <div className="part-center part-handle" />
      <div className="part-center part-1-left" />
      <div className="part-center part-1-right" />
      <div className="part-center part-2-left" />
      <div className="part-center part-2-right" />
      <div className="part-center part-3-left" />
      <div className="part-center part-3-right" />
      <div className="part-center part-4" />
    </div>
  </div>
)

const PokeBadge = () => {
  return (
    <div className="pokemon-badge-wrapper">
      <Boulder />
      <Cascade />
      <Thunder />
      <Rainbow />
      <Soul />
      <Marsh />
      <Volcano />
      <Earth />
    </div>
  )
}

export default PokeBadge
