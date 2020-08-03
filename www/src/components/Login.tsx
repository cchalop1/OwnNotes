import React, { useState } from "react";

interface Props {
    setUser: (arg: null | string) => void;
}

const API = "http://localhost:8000"

export const Login: React.FC<Props> = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: any) => {
        setPassword("");
        const data = {
            email: email,
            password: password
        };
        fetch(API + "/login", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }).then(async res => {
            // props.setUser()
            console.log(await res.json());
        }).catch(async err => {
            console.error(await err.json());
        });
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <input type="text" value={email} placeholder="enter your email" onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} placeholder="enter your password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div >
    );
}
