export default [{
  route: 'home',
  icon: 'home',
  title: 'Home'
},
// {
//   icon: 'line-chart',
//   title: 'Echarts',
//   key: 'echarts',
//   childs: [{
//     icon: 'edit',
//     title: 'Sub Echarts',
//     key: 'sub-echarts',
//     childs: [{
//       route: 'pie-chart',
//       icon: 'pie-chart',
//       title: 'Pie Chart'
//     }]
//   }]
// }, 
{
  route: 'pie-chart',
  icon: 'pie-chart',
  title: 'Pie Chart'
}, {
  route: 'widgets',
  icon: 'tool',
  title: 'Widgets'
}, {
  route: 'matrix',
  icon: 'ts-app icon-matrix',
  title: 'Matrix Multiplication'
}, {
  route: 'food',
  icon: 'ts-app icon-food',
  title: 'Food'
}, {
  route: 'music-visualization',
  icon: 'ts-app icon-music',
  title: 'Music Visualization'
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