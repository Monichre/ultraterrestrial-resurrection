## Pill Component – Pseudocode

Goal: Animated pill navigation with active item, hover highlight, and optional detail text toggle.

State

- hoverState: { opacity, left, width }
- activeState: { opacity, left, width }
- active: number (index)
- isHovering: boolean
- isClicked: boolean (toggle to show description)

Refs

- itemRefs: store li element refs to read offsetLeft/offsetWidth

Data

- items: [{ name, icon, text, description, color, bg }]

Effects

- on active change: measure active li, update activeState {opacity:1,left,width}

Handlers

- handleMouseEnter(i): measure li[i], set hoverState {opacity:1,left,width}, set isHovering true
- handleMouseLeave: set hoverState.opacity=0, isHovering false
- on li click: set isClicked false, set active index
- on button click: toggle isClicked

Render

- Top pill: icon + active.name, optional description when isClicked, and a colorized button using items[active].color/bg
- Bottom nav: list of motion.li items; absolute motion.div background animated between hoverState and activeState

Animation

- Use framer-motion layout + spring transitions for smooth width/position changes

Exports

- Named export: { Pill }
