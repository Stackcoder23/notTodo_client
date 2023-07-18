import React, { useState } from "react";

export const UserContext = React.createContext(null);

export function Context(props) {
    const [logged, setLogged] = useState({
        Logged: false,
        user: '',
        role: ''
    });

    const login = (email, userrole) => {
        setLogged({
            Logged: true,
            user: email,
            role: userrole,
        })
    }

    const logout = () => {
        
        setLogged({
            Logged: false,
            user: '',
            role: ''
        })
    }

    return (
        <UserContext.Provider value={{ logged, login, logout }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default Context;