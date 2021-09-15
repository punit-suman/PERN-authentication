import React from 'react'
import Axios from 'axios'

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            usernamefield: "",
            passwordfield: "",
            message: ""
        }
    }
    setUsername = (val) => {
        this.setState({username: val})
    }
    setPassword = (val) => {
        this.setState({password: val})
    }
    checkUsername = () => {
        if (this.state.username === "") {
            return false
        }
        return true
    }
    setUsernameRequired = (val) => {
        if (val) {
            this.setState({usernamefield: "field-required"})
        } else {
            this.setState({usernamefield: ""})
        }
    }
    checkPassword = () => {
        if (this.state.password === "") {
            return false
        }
        return true
    }
    setPasswordRequired = (val) => {
        if (val) {
            this.setState({passwordfield: "field-required"})
        } else {
            this.setState({passwordfield: ""})
        }
    }
    setMessage = (val) => {
        this.setState({message: val})
    }
    login = async e => {
        e.preventDefault()
        var error = false
        if (!this.checkUsername()) {
            this.setUsernameRequired(true)
            error = true
        } else {
            this.setUsernameRequired(false)
        }
        if (!this.checkPassword()) {
            this.setPasswordRequired(true)
            error = true
        } else {
            this.setPasswordRequired(false)
        }
        if (error) {
            return
        }
        await Axios.post('/api/login', {
            username: this.state.username,
            password: this.state.password
        }).then((response) => {
            if (response.data.userdetails) {
                window.location.href = "/"
            } else if (response.data.message) {
                this.setMessage(response.data.message)
            } else {
                alert(response.data)
            }
        })
    }
    render() {
        return(
            <div className="login">
                <span className="message">{this.state.message}</span>
                <form onSubmit={e => this.login(e)}>
                    <div className="input-container">
                        <input type="text" onChange={(e)=>this.setUsername(e.target.value)} placeholder="username" className={this.state.usernamefield} />
                    </div>
                    <div className="input-container">
                        <input type="password" onChange={(e)=>this.setPassword(e.target.value)} placeholder="password" className={this.state.passwordfield} />
                    </div>
                    <div className="login-btn-container">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login