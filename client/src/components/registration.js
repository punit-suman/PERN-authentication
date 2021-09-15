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

    // to check if a character is alphabet
    isAlpha = (val) => {
        if ((val <= 'z' && val >= 'a') || (val <= 'Z' && val >= 'A')) {
            return true
        } else {
            return false
        }
    }

    // to check if a character is alphabet or numeric
    isAlphaNum = (val) => {
        if ((val <= 'z' && val >= 'a') || (val <= 'Z' && val >= 'A') || (val <= "9" && val >= "0")) {
            return true
        } else {
            return false
        }
    }

    setUsername = (val) => {
        // to let delete the first alphabet else val.length = -1
        if (val.length === 0) {
            this.setState({username: val})
            return
        }
        // to only let include alphabet and number in username
        if (!this.isAlphaNum(val.charAt(val.length-1))) {
            return
        }
        this.setState({username: val}, () => {
            // check if username already exists
            Axios.get(`/api/checkusername/${this.state.username}`).then((response) => {
                if (response.data.usernameAlreadyRegistered) {
                    // error if username already registered
                    this.setUsernameRequired(true)
                    this.setState({usernamepresent: true})
                    this.setMessage("Username already in use.")
                } else {
                    this.setUsernameRequired(false)
                    this.setState({usernamepresent: false})
                    this.setMessage("")
                }
            })
        })
    }
    setPassword = (val) => {
        this.setState({password: val})
    }
    setFirstname = (val) => {
        // to let delete the first alphabet else val.length = -1
        if (val.length === 0) {
            this.setState({firstname: val})
            return
        }
        // to only let include alphabet in firstname
        if (!this.isAlpha(val.charAt(val.length-1))) {
            return
        }
        this.setState({firstname: val})
    }
    setLastname = (val) => {
        // to let delete the first alphabet else val.length = -1
        if (val.length === 0) {
            this.setState({lastname: val})
            return
        }
        // to only let include alphabet in lastname
        if (!this.isAlpha(val.charAt(val.length-1))) {
            return
        }
        this.setState({lastname: val})
    }
    // if input for firstname is empty
    checkFirstname = () => {
        if (this.state.firstname === "") {
            return false
        }
        return true
    }
    // set class for firstname when empty to show error
    setFirstnameRequired = (val) => {
        if (val) {
            this.setState({firstnamefield: "field-required"})
        } else {
            this.setState({firstnamefield: ""})
        }
    }
    // if input for username is empty
    checkUsername = () => {
        if (this.state.username === "") {
            return false
        }
        return true
    }
    // set class for username when empty to show error
    setUsernameRequired = (val) => {
        if (val) {
            this.setState({usernamefield: "field-required"})
        } else {
            this.setState({usernamefield: ""})
        }
    }
    // if input for password is empty
    checkPassword = () => {
        if (this.state.password === "") {
            return false
        }
        return true
    }
    // set class for password when empty to show error
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
    // handler function when register button is clicked
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
        // if any error in input then do not proceed
        if (error) {
            this.setMessage("Please fill required inputs.")
            return
        }
        // sending POST request
        Axios.post('/api/register', {
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname
        }).then((response) => {
            // if error in response
            if (response.data.error) {
                this.setMessage(response.data.error)
                return
            }
            // successful registration
            if (response.data.message) {
                this.setMessage(response.data.message + " Redirecting to Login...")
                setTimeout(function(){window.location.reload()}, 2000)
            } else {
                this.setMessage("Try again later!")
            }
        })
    }
    render() {
        return(
            <div className="register">
                <span className="message">{this.state.message}</span>
                <form onSubmit={e => this.register(e)}>
                    <div className="input-container">
                        <input type="text" value={this.state.firstname} onChange={(e) => this.setFirstname(e.target.value)} placeholder="first name" className={this.state.firstnamefield} />
                    </div>
                    <div className="input-container">
                        <input type="text" value={this.state.lastname} onChange={(e) => this.setLastname(e.target.value)} placeholder="last name" />
                    </div>
                    <div className="input-container">
                        <input type="text" value={this.state.username} onChange={(e) => this.setUsername(e.target.value)} placeholder="username" className={this.state.usernamefield} />
                    </div>
                    <div className="input-container">
                        <input type="password" value={this.state.password} onChange={(e) => this.setPassword(e.target.value)} placeholder="password" className={this.state.passwordfield} />
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