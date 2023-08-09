import axios from 'axios';

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
const ESTRUCTUREPOINT = process.env.NEXT_PUBLIC_API_ESTRUCTURE;

export const uploadFileForm = async(data) => {
    try {
        let response = await axios.post(`${ENDPOINT}${PREFIX}/file/upload`, {'files':data},{
            headers: {
                "content-type": "multipart/form-data",
              },  
        });
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