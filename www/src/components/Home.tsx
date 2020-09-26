import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { fetchMe, fetchNotes } from "../utils/fetchApi";
import { EditNote } from "./EditNote";
import { ListNotes } from "./ListNotes";

export interface AuthData {
    success: boolean;
    userId: string;
    jwt: string;
}

interface Props extends RouteComponentProps { }

const getAuthDataLocalStorage = () => {
    const rawData: null | string = localStorage.getItem("login");

    if (!rawData) {
        return null;
    }

    return JSON.parse(rawData) as AuthData;
}

export const Home: React.FC<Props> = ({ history }) => {
    const authData = useState<AuthData | null>(getAuthDataLocalStorage());
    const [focuseNote, setFocuseNote] = useState<null | any>(null);

    // useEffect(() => {
    //     if (!authData) {
    //         history.push("/login");
    //     } else {
    //         if (authData[0] == null) {
    //             history.push("/login");
    //         } else {
    //             fetchMe(authData[0].userId)
    //                 .then(res => setUserData(res));
    //         }
    //     }
    // }, []);

    return (
        <div className="home">
            <h1>Home</h1>
            {authData[0] ? <ListNotes setFocuseNote={setFocuseNote} authData={authData[0]} /> : <div></div>}
            {(authData[0]) ? <EditNote authData={authData[0]} focuseNote={focuseNote} /> : <div></div>}
            {/* <EditNote /> */}
            {/* <Parame> */}
            {/* <button onClick={() => setEditNote(true)}>New note</button> */}
            {/* {authData[0] ? <ListNotes authData={authData[0]} /> : null} */}
            <button onClick={() => {
                localStorage.removeItem('login');
                history.push("/login");
            }}>logout</button>
        </div >
    );
}
