"use client"
import MapPolygon from "../../components/mod-polygon/modedPolygon"
import DInput from "./Elements/dynamic_input"

interface data {
    attribute: string,
    hint: string,
    label: string,
    multiline: boolean,
    required: boolean,
    type: string,
    options: string,
    API: string,
    minrows: number,
    multirow: boolean,
    category: any,
    indexPerObject: any,
    allowed_mime_types: Array<[]>,
    fill_color: string,
    border_color: string,
    formControllerIndex: number,
    value: Array<[]>,
}

const FormHelper = ({ attr, projectData, handleInputChange }: { attr: data, projectData: any, handleInputChange?: Function, handlePolygonChange: Function }) => {
    const temp = () => {};
    switch(attr.type) {
        case "String":
            return <DInput.InputText info={attr} savedData={projectData} callback={handleInputChange || temp} />
        case "StaticList":
            return <DInput.SelectStatic info={attr} savedData={projectData} callback={handleInputChange || temp} />
        case "DynamicList":
            return <DInput.SelectDynamic info={attr} savedData={projectData} callback={handleInputChange || temp} />
        case "MultiSelectList":
            return <DInput.MultiSelect info={attr} savedData={projectData} callback={handleInputChange || temp} />
        case "Boolean":
            return <DInput.Booleano info={attr} savedData={projectData} callback={handleInputChange || temp} />
        case "Date":
            return <DInput.Date info={attr} savedData={projectData} callback={handleInputChange || temp} />
        case "LocationPolygon":
            return <MapPolygon info={attr} savedData={projectData} callback={handleInputChange} canWrite={true}/>
    }
}
export default FormHelper