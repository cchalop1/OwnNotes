const API = "http://localhost:8000"

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export interface MeData {
    userId: string;
}

export const fetchLogin = async (data: LoginData) => {
    const option = {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-type': 'application/json'
        })
    };
    const res = await fetch(API + "/login", option);
    return await res.json();
}

export const fetchRegister = async (data: RegisterData) => {
    const option = {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-type': 'application/json'
        })
    };
    const res = await fetch(API + "/register", option);
    return await res.json();
}

export const fetchMe = async (userId: string) => {
    const authData = localStorage.getItem("login");
    if (!authData)
        return new Error("local storage");
    const option = {
        method: "POST",
        body: JSON.stringify({ userId: userId }),
        headers: new Headers({
            "Content-type": "application/json",
            "Authorization": JSON.parse(authData).jwt
        })
    };
    return await (await fetch(API + "/me", option)).json();
}