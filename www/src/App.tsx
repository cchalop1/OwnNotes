import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";

interface Props { }

const App: React.FC<Props> = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/register" exact component={Register} />
                <Route path="/login" exact component={Login} />
                <Route path="/" render={() => <div>404</div>} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
