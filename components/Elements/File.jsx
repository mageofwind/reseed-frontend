import React from "react";
import FormData from "form-data";
import { uploadFileForm } from './service/uploadFile.service';

const File = ({ type, label, hint, required, attribute, name = "" }) => {

    const onHandleFile = async (e) => {
        console.log('Evento image ->', e.target.files[0]);
        let data = new FormData();
        data.append('files', e.target.files[0]);
        // for (var pair of data.entries()){
        //     console.log('Hi Test ->', pair[0], pair[1]);
        // }
        let response = await uploadFileForm(data);
        console.log('response image ->', response);
    }

    return (
        <div className="col-6 mb-3">
            <label className="labelform" title={hint}>{label}</label>
            <div className="custom-file">
                <input onChange={(e) => { onHandleFile(e) }} name={name} type="file" className="custom-file-input" id={attribute} />
                <label className="custom-file-label">{label}</label>
            </div>
        </div>
    )
}

export default File;