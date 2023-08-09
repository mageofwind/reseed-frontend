import ls from "@/utils/localStorage/ls";
import axios from "axios"

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
const ESTRUCTUREPOINT = process.env.NEXT_PUBLIC_API_ESTRUCTURE;

export const userInfo = async (iduser: any) => {
    try {
        let response = await axios.get(`${ENDPOINT}${PREFIX}/auth/signup/page/${iduser}`);
        return response.data
    } catch (error: any) {
        if (error.response) {
            return error.response.data
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
}

export const pageEstructure = async () => {
    try {
        let response = await axios.get(`${ESTRUCTUREPOINT}/vvb/signup/pages`);
        return response.data

    } catch (error: any) {
        if (error.response) {
            return error.response.data
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
}

export const signup = async (data: any) => {
    try {
        let response = await axios.post(`${ENDPOINT}${PREFIX}/auth/signup/vvb/basic-info`, data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
}

export const updateMetaDataUser = async (data: any) => {
    let usuario = ls.getStorage("user")
    try {
        let response = await axios.put(`${ENDPOINT}${PREFIX}/auth/signup/vvb/${usuario._id}/metadata`, data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
}