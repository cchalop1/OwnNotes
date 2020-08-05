import React, { useState } from "react";
import { AuthData } from "./Home";

import { fetchNewNote } from "../utils/fetchApi";

interface Props {
    authData: AuthData;
}

export const EditNote: React.FC<Props> = (props) => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<null | string>(null);

    const sendNewNote = async () => {
        if (!title || !content)
            setError("fill all input for create new note");
        // TODO : fecht api
        const res = await fetchNewNote(props.authData.userId, title, content)
        console.log(res);
    }

    return (
        <div className="editNote">
            <h3>Title:</h3>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            <h3>content:</h3>
            <textarea name="content" value={content} onChange={e => setContent(e.target.value)}></textarea>
            {error ? <p style={{ color: "red" }}>{error}</p> : <p></p>}
            <button onClick={sendNewNote}>Save</button>
        </div>
    );
}