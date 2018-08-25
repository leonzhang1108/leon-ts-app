export default [{
  route: 'home',
  icon: 'home',
  title: 'Home'
}, {
  route: 'bat-logo',
  icon: 'ts-app icon-batman-logo',
  title: 'Bat Logo'
}, {
  icon: 'profile',
  title: 'Common',
  key: 'common',
  childs: [{
    route: 'camera',
    icon: 'camera',
    title: 'Camera'
  }, {
    route: 'matrix',
    icon: 'ts-app icon-matrix',
    title: 'Matrix'
  }, {
    route: 'widgets',
    icon: 'tool',
    title: 'Widgets'
  }, {
    route: 'infinite-list',
    icon: 'ts-app icon-list',
    title: 'Infinite List'
  }]
}, {
  icon: 'ts-app icon-canvas',
  title: 'Canvas',
  key: 'canvas',
  childs: [{
    route: 'pie-chart',
    icon: 'pie-chart',
    title: 'Pie Chart'
  }, {
    route: 'food',
    icon: 'ts-app icon-food',
    title: 'Food'
  }, {
    route: 'music-visualizer',
    icon: 'ts-app icon-music',
    title: 'Music Visualizer'
  }, {
    route: 'sad-man',
    icon: 'ts-app icon-sad',
    title: 'Sad Man'
  }]
}, {
  icon: 'ts-app icon-game',
  title: 'Game',
  key: 'game',
  childs: [{
    route: 'gobang',
    icon: 'ts-app icon-gobang',
    title: 'Gobang'
  }, {
    route: 'reversi',
    icon: 'ts-app icon-reversi',
    title: 'Reversi'
  }, {
    route: '2048',
    icon: 'ts-app icon-2048',
    title: '2048'
  }, {
    route: 'tetris',
    icon: 'ts-app icon-tetris',
    title: 'Tetris'
  }]
}, {
  route: 'the-fuck-is-that',
  icon: 'ts-app icon-404',
  title: 'The Fuck Is That'
}]
