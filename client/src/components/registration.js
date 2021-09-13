import React from 'react'
import Axios from 'axios'

class Registration extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            firstname: "",
            lastname: "",
            firstnamefield: "",
            usernamefield: "",
            passwordfield: "",
            usernamepresent: false,
            message: ""
        }
    }
    setUsername = async (val) => {
        this.setState({username: val}, () => {
            Axios.get(`/checkUsernameAPI/${this.state.username}`).then((response) => {
                if (response.data.message === "username present") {
                    this.setUsernameRequired(true)
                    this.setState({usernamepresent: true})
                } else {
                    this.setUsernameRequired(false)
                    this.setState({usernamepresent: false})
                }
            })
        })
    }
    setPassword = (val) => {
        this.setState({password: val})
    }
    setFirstname = (val) => {
        this.setState({firstname: val})
    }
    setLastname = (val) => {
        this.setState({lastname: val})
    }
    checkFirstname = () => {
        if (this.state.firstname === "") {
            return false
        }
        return true
    }
    setFirstnameRequired = (val) => {
        if (val) {
            this.setState({firstnamefield: "field-required"})
        } else {
            this.setState({firstnamefield: ""})
        }
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
    register = async e => {
        e.preventDefault()
        var error = false
        if (!this.checkFirstname()) {
            this.setFirstnameRequired(true)
            error = true
        } else {
            this.setFirstnameRequired(false)
        }
        if (!this.checkUsername() || this.state.usernamepresent) {
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
        await Axios.post('/registerAPI', {
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname
        }).then((response) => {
            if (response.data.message) {
                this.setMessage(response.data.message + " Redirecting to Login...")
                setTimeout(function(){window.location.reload()}, 2000)
            } else {
                this.setMessage("Try again later!")
            }
        })
        return
    }
    render() {
        return(
            <div className="register">
                <span className="message">{this.state.message}</span>
                <form onSubmit={e => this.register(e)}>
                    <div className="input-container">
                        <input type="text" onChange={(e) => this.setFirstname(e.target.value)} placeholder="first name" className={this.state.firstnamefield} />
                    </div>
                    <div className="input-container">
                        <input type="text" onChange={(e) => this.setLastname(e.target.value)} placeholder="last name" />
                    </div>
                    <div className="input-container">
                        <input type="text" onChange={(e) => this.setUsername(e.target.value)} placeholder="username" className={this.state.usernamefield} />
                    </div>
                    <div className="input-container">
                        <input type="password" onChange={(e) => this.setPassword(e.target.value)} placeholder="password" className={this.state.passwordfield} />
                    </div>
                    <div className="register-btn-container">
                        <button type="submit">Register</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Registration