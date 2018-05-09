import { connect } from 'react-redux'

interface IConnectProp {
  component,
  mapStateToProps?,
  mapDispatchToProps?
}

export default {
  connect: ({
    component, 
    mapStateToProps, 
    mapDispatchToProps
  }:IConnectProp) => connect(
      mapStateToProps, 
      mapDispatchToProps
    )(component)
}