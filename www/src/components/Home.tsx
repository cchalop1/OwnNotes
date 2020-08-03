import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps { }

export const Home: React.FC<Props> = ({ history }) => {
    const user = useState<null | string>(localStorage.getItem("login"));

    if (!user[0]) {
        history.push("/login")
    }

    return (
        <div className="home">
            <h1>Home</h1>
            <button onClick={() => {
                localStorage.removeItem('login');
                history.push("/login");
            }}>logout</button>
        </div >
    );
}
