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
  }),
  toCamelCase: str => {
    // toCamelCase
    const [first, ...rest] = str.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase())
    return first.toUpperCase() + rest
  }
}

interface IConnectProps {
  component,
  mapStateToProps?,
  mapDispatchToProps?
}