import axios from "axios"

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;

export const signup = async(data: any) => {
    try {
        let response = await axios.post(`${ENDPOINT}${PREFIX}/auth/signup/pp/basic-info`, data);
        return response.data;
    } catch (error:any) {
        if (error.response){
            return error.response.data
        }else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          console.log(error.config);
    }
}