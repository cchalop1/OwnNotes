import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { fetchMe, fetchNotes } from "../utils/fetchApi";
import { EditNote } from "./EditNote";

export interface AuthData {
    success: boolean;
    userId: string;
    jwt: string;
}

interface Props extends RouteComponentProps { }

const getAuthDataLocalStorage = () => {
    const rawData: null | string = localStorage.getItem("login");

    if (!rawData)
        return null;
    return JSON.parse(rawData) as AuthData;
}

export const Home: React.FC<Props> = ({ history }) => {
    const authData = useState<AuthData | null>(getAuthDataLocalStorage());
    const [userData, setUserData] = useState<null | any>(null);
    const [editNote, setEditNote] = useState<Boolean>(false);

    useEffect(() => {
        if (!authData) {
            history.push("/login");
        } else {
            if (authData[0] == null) {
                history.push("/login");
            } else {
                fetchMe(authData[0].userId)
                    .then(res => setUserData(res));
                fetchNotes(authData[0].userId)
                    .then(res => {
                        console.log(res);
                        // display list  
                    })
            }
        }
    }, []);

    return (
        <div className="home">
            <h1>Home</h1>
            <h3>{userData ? userData.username : ''}</h3>
            <h3>{userData ? userData.email : ''}</h3>
            <button onClick={() => setEditNote(true)}>New note</button>
            {(editNote && authData[0]) ? <EditNote authData={authData[0]} /> : null}
            <button onClick={() => {
                localStorage.removeItem('login');
                history.push("/login");
            }}>logout</button>
        </div >
    );
}
