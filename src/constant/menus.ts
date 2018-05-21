export default [{
  route: 'home',
  icon: 'home',
  title: 'Home'
}, {
  icon: 'line-chart',
  title: 'Echarts',
  key: 'echarts',
  childs: [{
    icon: 'edit',
    title: 'Sub Echarts',
    key: 'sub-echarts',
    childs: [{
      route: 'pie-chart',
      icon: 'pie-chart',
      title: 'Pie Chart'
    }]
  }]
}, {
  route: 'op3',
  icon: 'inbox',
  title: 'Option 3'
}]