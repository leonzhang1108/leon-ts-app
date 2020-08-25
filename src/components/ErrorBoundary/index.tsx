import React from 'react'
import Utils from '@utils'

interface IState {
  hasError: boolean;
  route: string;
}

interface IProps {
  children: Record<string, any>;
}

class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      route: ''
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.route !== prevState.route) {
      return {
        route: nextProps.route,
        hasError: false
      }
    }
    return prevState
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true })
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}

export default Utils.connect({
  component: ErrorBoundary,
  mapStateToProps: state => {
    return {
      route: state.common.route
    }
  }
})
