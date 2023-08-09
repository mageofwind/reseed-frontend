import axios from 'axios';

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
const ESTRUCTUREPOINT = process.env.NEXT_PUBLIC_API_ESTRUCTURE;

export const submitForm = async(useriD, userRol) => {
    try {
        let response = await axios.put(`${ENDPOINT}${PREFIX}/auth/signup/${userRol}/${useriD}/submit`);
        console.log('res', response)
        return response.data
    } catch (error) {
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