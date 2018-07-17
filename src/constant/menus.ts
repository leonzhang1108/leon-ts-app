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
  icon: 'codepen',
  title: 'Matrix Multiplication'
}, {
  route: 'food',
  icon: 'shopping-cart',
  title: 'Food'
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
  }]
}, {
  route: 'the-fuck-is-that',
  icon: 'inbox',
  title: 'The Fuck Is That'
}]