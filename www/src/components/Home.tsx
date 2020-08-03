import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { fetchMe } from "../utils/fetchApi";

interface Props extends RouteComponentProps { }

export const Home: React.FC<Props> = ({ history }) => {
    const authData = useState<null | string>(localStorage.getItem("login"));
    const [userData, setUserData] = useState<null | any>(null);

    useEffect(() => {
        if (!authData[0]) {
            history.push("/login")
        } else {
            fetchMe(JSON.parse(authData[0]).userId)
                .then(res => setUserData(res));
        }
    }, []);

    return (
        <div className="home">
            <h1>Home</h1>
            <h3>{userData ? userData.username : ''}</h3>
            <h3>{userData ? userData.email : ''}</h3>
            <button onClick={() => {
                localStorage.removeItem('login');
                history.push("/login");
            }}>logout</button>
        </div >
    );
}
