import { connect } from 'react-redux'

export default {
  connect: (component, mapStateToProps, mapDispatchToProps) =>
    connect(mapStateToProps, mapDispatchToProps)(component)
}