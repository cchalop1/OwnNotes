import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps {
    user: string | null;
}

export const Home: React.FC<Props> = ({user, history}) => {

    if (!user) {
        history.push("./login")
    }

    return (
        <h1>Home</h1>
    );
}
