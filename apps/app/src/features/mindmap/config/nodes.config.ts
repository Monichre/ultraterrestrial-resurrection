export const ROOT_NODES = [
  'topics',
  'events',
  'personnel',
  'testimonies',
  'organizations',
  'testimonies',
]

export const ROOT_NODE_IDS = ROOT_NODES.map( ( type ) => `${type}-root-node` )

export const ROOT_NODE_POSITIONS: any = {
  events: {
    x: -300,
    y: 300,
    childNodeDirection: 'left',
  },
  topics: {
    x: 0,
    y: 300,
    childNodeDirection: 'below',
  },
  personnel: {
    x: 300,
    y: 300,
    childNodeDirection: 'above',
  },
  testimonies: {
    x: 600,
    y: 300,
    childNodeDirection: 'below',
  },
  organizations: {
    x: 900,
    y: 300,
    childNodeDirection: 'right',
  },
}

// !TODO: Make this responsive

export const ROOT_NODE_WIDTH = 225
export const ROOT_NODE_HEIGHT = 200

export const BASE_ENTITY_NODE_WIDTH = 200
export const BASE_ENTITY_NODE_HEIGHT = 250
export const NODE_SPACE = 50

export const ROOT_DIMENSIONS = {
  width: ROOT_NODE_WIDTH,
  height: ROOT_NODE_HEIGHT,
}

export const GROUP_NODE_HEIGHT = 600
export const GROUP_NODE_WIDTH = 900
export const GROUP_NODE_LANDSCAPE = {
  width: GROUP_NODE_HEIGHT,
  height: GROUP_NODE_WIDTH,
}
export const GROUP_NODE_DIMENSIONS = {
  height: GROUP_NODE_HEIGHT,
  width: GROUP_NODE_WIDTH,
}
export const CHILD_DIMENSIONS = {
  width: BASE_ENTITY_NODE_WIDTH,
  height: BASE_ENTITY_NODE_HEIGHT,
}
export const PADDING = 75

export const entityGroupNodeBaseConfig = {

  type: 'entityGroupNode',
  initialHeight: GROUP_NODE_LANDSCAPE.height,
  initialWidth: GROUP_NODE_LANDSCAPE.width,
  // zIndex: 1,
  style: {
    width: `${GROUP_NODE_LANDSCAPE.width}px`,
    height: `${GROUP_NODE_LANDSCAPE.height}px`,
  },
}
