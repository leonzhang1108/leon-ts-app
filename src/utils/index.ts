import { connect } from 'react-redux'

export default {
  connect: ({
    component,
    mapStateToProps,
    mapDispatchToProps
  }: IConnectProp) => connect(
    mapStateToProps,
    mapDispatchToProps
  )(component)
}

interface IConnectProp {
  component,
  mapStateToProps?,
  mapDispatchToProps?
}