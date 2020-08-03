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