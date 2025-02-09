import {BASE_URL} from "../../utils/constants.ts";

export const request = (endpoint:string, options?:RequestInit, ) => {
    return fetch(BASE_URL + "/" + endpoint, options).then(checkResponse);
}

const checkResponse = (res:Response) => {
    if (!res.ok) {
        throw new Error("Ошибка! Не удалось установить соединение с сервером");
    }
    return res.json();
}