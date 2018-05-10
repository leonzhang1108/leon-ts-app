import { connect } from 'react-redux'
import * as Loadable from 'react-loadable'
import PageLoading from '@components/PageLoading'

export default {
  connect: ({
    component,
    mapStateToProps,
    mapDispatchToProps
  }: IConnectProps) => connect(
    mapStateToProps,
    mapDispatchToProps
  )(component),
  load: component => Loadable({
    loader: () => import(`../pages/${component}`),
    loading: PageLoading
  })
}

interface IConnectProps {
  component,
  mapStateToProps?,
  mapDispatchToProps?
}