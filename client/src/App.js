import React, { useEffect, useState } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Axios from 'axios';
import "./App.css";

import Homepage from './routes/home'
import LoginPage from './routes/loginpage'
import Profile from './routes/profile'
import PageNotFound from './routes/pagenotfound'

function App() {
    const [loginDetail, setLoginDetail] = useState('')
    const [responseStatus, setResponseStatus] = useState(false)
    Axios.defaults.withCredentials = true
    useEffect(() => {
        function checkLoggedIn() {
        Axios.get("/loginAPI").then((response)=>{
            if (response.data.LoggedIn) {
                setLoginDetail(response.data.user)
            }
            setTimeout(()=>{
                setResponseStatus(true)
            }, 500)
        })
    }
    checkLoggedIn();
    }, [])
    if (!responseStatus) {
        return (
            <div>
                <div className="loader-wrapper">
                    <div className="loader"></div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={() => (<Homepage loginDetail={loginDetail} />)} exact />
                    <Route path="/authenticate" component={() => (<LoginPage loginDetail={loginDetail} />)} exact />
                    <Route path="/u/*/*" component={PageNotFound} />
                    <Route path="/u/*" component={() => (<Profile loginDetail={loginDetail} responseStatus = {responseStatus} />)} exact />
                    <Route component={PageNotFound} />
                </Switch>
            </BrowserRouter>

            
        </div>
    );
}

export default App