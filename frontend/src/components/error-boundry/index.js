import  React  from "react";


//-- Error boundry to render fallback components on error
class ErrorBoundry extends React.Component {

    constructor(){
        super();
        this.state = {
            hasError : false
        }
    }

    componentDidCatch(err , info ) {
        this.setState({
            hasError : true
        })
    }

    render () {
        return this.state.hasError ? <h1> Opps !!! .... </h1> : this.props.children;
    }
}

export default ErrorBoundry;