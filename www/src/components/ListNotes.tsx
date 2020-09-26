import React, { useState, useEffect } from "react";
import { AuthData } from "./Home";

import { fetchNotes } from "../utils/fetchApi";

interface Props {
    authData: AuthData;
    setFocuseNote: (arg: null | any) => void;
}

export const ListNotes: React.FC<Props> = (props) => {
    const [list, setList] = useState<null | any[]>(null);

    useEffect(() => {
        fetchNotes(props.authData.userId)
            .then(res => {
                if (res.success) {
                    setList(res.notes);
                } else {
                    setList([]);
                }
            });
    }, []);

    if (!list) {
        return (<div className="list">
            <p>loading...</p>
        </div>);
    } else if (list.length === 0) {
        return (<div className="list"></div>);
    } else {
        return (<div className="list">
            {list.map((note, idx) => {
                return (<div key={idx} style={{ height: "30px" }} onClick={() => {
                    props.setFocuseNote(note);
                    // console.log(note);
                }}>{note.title}</div>);
            })}
        </div>);
    }
}