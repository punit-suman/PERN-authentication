import React from 'react'
import {Link} from 'react-router-dom'
import Axios from 'axios'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginDetail: this.props.loginDetail,
            expandmenu: "hide"
        }
    }
    logout = e => {
        Axios.get('/api/logout').then((response) => {
            console.log(response.data)
        })
        window.location.reload()
    }
    expandMenu = e => {
        if (this.state.expandmenu === "hide"){
            this.setState({expandmenu: "show"})
        } else {
            this.setState({expandmenu: "hide"})
        }
    }
    render() {
        return (
            <div className="navbar">
                <div className="main-container">
                    <div className="left-menu-expand" onClick={e => this.expandMenu(e)}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                    <div className="left">
                        <Link to="/" className="link">Home</Link>
                    </div>
                    {this.state.loginDetail !== "" ?
                    <div className="right">
                        <div className="items">
                            <Link to={`/u/${this.state.loginDetail.username}`} className="hello-msg">Profile</Link>
                        </div>
                        <div className="items">
                            <button className="logout-btn" onClick={e => this.logout(e)}>Logout</button>
                        </div>
                    </div>
                    :
                    <div className="right">
                        <div className="items">
                            <Link to="/authenticate" className="login-link">Login</Link>
                        </div>
                    </div>
                    }
                    <div className={`expand-menu ${this.state.expandmenu}`}>
                        <div className="items">
                            <Link to="/" className="link">Home</Link>
                        </div>
                        <div className="items">
                            About Us
                        </div>
                        <div className="items">
                            Contact Us
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Navbar