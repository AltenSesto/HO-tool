import React, { Component } from 'react';

interface State {
    error?: Error
}

interface Props {}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {};
    }

    static getDerivedStateFromError(error: Error) {
      // Update state so the next render will show the fallback UI.
      return { error: error };
    }
  
    componentDidCatch(error: Error) {
      this.setState({ error });
    }
  
    render() {
      if (this.state.error) {
        return <h1>{'ERROR: ' + this.state.error.message}</h1>;
      }
      return this.props.children;
    }
  }

  export default ErrorBoundary;
