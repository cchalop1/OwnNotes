import React, { useState } from "react";
import { LoginData, fetchLogin } from "../utils/auth";
import { RouteComponentProps, Link } from "react-router-dom"

interface Props extends RouteComponentProps { }


export const Login: React.FC<Props> = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: any) => {
        const data: LoginData = {
            email: email,
            password: password
        };
        const res = await fetchLogin(data);
        if (!res.success) {

        }
        fetchLogin(data).then(res => {
            localStorage.setItem("login", JSON.stringify(res));
            history.push("/");
        });
        setPassword("");
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <input type="text" value={email} placeholder="enter your email" onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} placeholder="enter your password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <Link to="/register">register accout</Link>
        </div >
    );
}
