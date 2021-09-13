import React from 'react'
import Axios from 'axios'
import Navbar from '../components/navbar'

export default function Profile({loginDetail, responseStatus}) {
    
    Axios.defaults.withCredentials = true
    
    if (responseStatus && loginDetail !== "") {
        return (
            <div>
                <Navbar loginDetail={loginDetail} />
                <br></br>
                <br></br>
                <br></br>
                {loginDetail.firstname} {loginDetail.lastname}
            </div>
        )
    } else if (responseStatus && loginDetail === "") {
        window.location.href = "/authenticate"
    }
    return (
        <div>

        </div>
    )
}