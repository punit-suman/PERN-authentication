import React from 'react'

class PageNotFound extends React.Component {
    constructor(){
        super()
        this.state = {
            message: ""
        }
    }
    setMessage = (value) => {
        this.setState({message: value})
    }
    componentDidMount() {
        this.setMessage("Error 404: Page Not Found!")
    }
    render() {
        return (
            <div className="page-not-found-container">
                <span className="page-not-found-message" >{this.state.message}</span>
            </div>
        )
    }
}

export default PageNotFound