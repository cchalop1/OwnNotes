import React, { useState } from "react";
import { RegisterData, fetchRegister } from "../utils/fetchApi";
import { RouteComponentProps, Link } from "react-router-dom"

interface Props extends RouteComponentProps { }

export const Register: React.FC<Props> = ({ history }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: any) => {
        const data: RegisterData = {
            email: email,
            username: username,
            password: password
        };
        const res = await fetchRegister(data);
        if (!res.success) {
            console.error(res.message);
            return;
        }
        history.push("/login");
    }
    return (
        <div className="register">
            <h1>Register</h1>
            <input type="text" value={email} placeholder="enter your email" onChange={e => setEmail(e.target.value)} />
            <input type="text" value={username} placeholder="enter your username" onChange={e => setUsername(e.target.value)} />
            <input type="password" value={password} placeholder="enter your password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
            <Link to="/login">I have a acout</Link>
        </div>
    );
}