import React, { useContext, useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "./Context";

export default function Login() {
    const [loginRegister, setLoginRegister] = useState("login");
    const [adminEmployee, setAdminEmployee] = useState("employee");
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const navigate = useNavigate();
    const [state, setState] = useState({
        open: false,
        message: '',
    });
    const [newEmail, setNewEmail] = useState();
    const [newPass, setNewPass] = useState();
    const [name, setName] = useState();

    const login = useContext(UserContext).login;
    const loggedIn = useContext(UserContext).logged.Logged;

    const submit = async () => {
        if (loginRegister == 'login') {
            if (email && pass) {
                let data = {
                    email: email,
                    password: pass,
                    role: adminEmployee,
                }
                await fetch("http://localhost:5000/login", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                })
                    .then(res => res.json())
                    .then(async (res) => {
                        if (res.error) {
                            setState({
                                open: true,
                                message: res.error,
                            })
                        }
                        else {
                            await login(res.email, res.role)
                            navigate("/home");
                        }
                    })
            }
        }
        else{
            if (name && newEmail && newPass) {
                let data = {
                    name: name,
                    email: newEmail,
                    password: newPass,
                    role: adminEmployee
                }
                await fetch("http://localhost:5000/register", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                })
                    .then(res => res.json())
                    .then(async (res) => {
                        if (res.error) {
                            setState({
                                open: true,
                                message: res.error,
                            })
                        }
                        else {
                            setState({
                                open: true,
                                message: "Registration Successful, You can login now",
                            })
                            setName();
                            setNewEmail();
                            setNewPass();
                            setLoginRegister('login');
                        }
                    })
            }
        }
    }

    return (
        <div style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
            textAlign: 'center',
            overflow: 'hidden',
            display: 'flex',
            backgroundColor: '#add8e6'
        }}>
            <div style={{ margin: '50px', height: '60vh', borderRadius: '25px', position: 'relative', width: '400px', backgroundColor: '#ffffff', overflow: 'auto' }}>
                <h3>{adminEmployee == 'employee' ? "Employee" : "HR Admin"}</h3>
                <button
                    onClick={() => setLoginRegister("login")}
                    style={{
                        backgroundColor: loginRegister == 'login' ? '#0d6efd' : 'white',
                        color: loginRegister == 'login' ? 'white' : 'black',
                    }}
                    className="switch">
                    Login
                </button>
                <button
                    onClick={() => setLoginRegister("register")}
                    style={{
                        backgroundColor: loginRegister == 'register' ? '#0d6efd' : 'white',
                        color: loginRegister == 'register' ? 'white' : 'black',
                    }}
                    className="switch">
                    Register
                </button>
                <div style={{ height: '55%' }}>
                    {
                        loginRegister == 'login' ?
                            <>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginTop: '80px' }} type="email" className="input" placeholder="Email" />
                                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" className="input" placeholder="Password" />
                            </>
                            :
                            <>
                                <input value={name} onChange={(e) => setName(e.target.value)} style={{ marginTop: '60px' }} type="text" className="input" placeholder="Name" />
                                <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" className="input" placeholder="Email" />
                                <input value={newPass} onChange={(e) => setNewPass(e.target.value)} type="password" className="input" placeholder="Password" />
                            </>
                    }
                </div>
                <button
                    onClick={() => adminEmployee == 'employee' ? setAdminEmployee('admin') : setAdminEmployee('employee')}
                    className="adminbutton">
                    {adminEmployee == 'employee' ? "Admin? Click here" : 'Not Admin? Click here'}
                </button>
                <button onClick={submit} className="loginbutton">{loginRegister == 'login' ? "Login" : "Register"}</button>
            </div>
            <Snackbar autoHideDuration={3000} onClose={() => setState({ open: false, message: '' })} open={state.open} message={state.message} />
        </div>
    )
}