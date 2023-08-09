import Service from "@/utils/api/services"
import { useEffect, useReducer, useRef, useState } from "react"
import create_style from "./create.module.scss"
import FormHelper from "./formHelper"
import MapPolygon from "../../components/mod-polygon/modedPolygon"
import Swal from "sweetalert2"
import ls from "@/utils/localStorage/ls"

export default function CreateProjects({ user }) {
    const [structure, setStructure] = useState([])
    const [pagePos, setPagePos] = useState(0)
    const [final, setFinal] = useState(false)
    const [duplicatorHelper, setDuplicator] = useState([])
    const polygonDataRef = useRef([])

    //TODO -----------------------------------------------------------------------------
    //* Reducer control inputs
    const getStored = () => {
        let savedProject = ls.getStorage("project")
        if (savedProject && savedProject?.metadata) {
            const metadata = savedProject.metadata
            let dataInputs = {}
            for (let props in metadata) {
                if (props === "meta") {
                    for (let insideMeta in metadata[props]) {
                        dataInputs[insideMeta] = metadata[props][insideMeta]
                        continue
                    }
                    continue
                }
                dataInputs[props] = metadata[props]
            }
            return { "data": savedProject, "dataInputs": dataInputs }
        } else {
            return { "data": {}, "dataInputs": {} }
        }
    }
    const dtsReducer = (state, action) => {
        const { type, input="", data="" } = action
        const { name, value, index, category="" } = input
        
        if (type === "update") {
            if (category !== "project_information"){
                let stateCopy = { ...state }
                const categoryArray = stateCopy.data?.metadata?.meta?.[category] || []

                if (categoryArray.length === 0) {
                    categoryArray.push({ [name]: value })
                } else if (!categoryArray[index]) {
                    categoryArray[index] = { [name]: value };
                } else {
                    categoryArray[index] = { ...categoryArray[index], [name]: value }
                }
                
                stateCopy.data = {
                    ...stateCopy["data"],
                    "metadata": {
                        ...stateCopy["data"]["metadata"],
                        "meta": {
                            ...stateCopy.data?.meta,
                            [category]: categoryArray
                        }
                    }
                }

                stateCopy.dataInputs = {
                    ...stateCopy["dataInputs"],
                    [category]: categoryArray
                }


                return stateCopy
            }
            let stateCopy = { ...state,
                "data": { ...state["data"], "metadata": { ...state["data"]["metadata"], [name]: value } },
                "dataInputs": { ...state["dataInputs"], [name]: value }
            }
            return stateCopy
        }
        if (type === "setnew") {
            return { ...state, "data": data }
        }
    }
    const [dataToSend, disDataToSend] = useReducer(dtsReducer, getStored())
    //TODO -----------------------------------------------------------------------------

    //TODO -----------------------------------------------------------------------------
    //* Reducer
    const fixReducer = (state, action) => {
        if (action?.type === "setup" && action?.data) return action.data
        if (action?.type === "duplicate") {
            return [...state, duplicatorHelper[action.category]]
        }
        if (action?.type === "updateData" && action?.newData && action?.title) {
            let newState = state.map(fil => {
                if (fil.category_label === action.title) {
                    const newAttributes = fil["attributes"].map(i => {
                        return Object.keys(action.newData).map(nd => {
                            if (nd === i.attribute) return { ...i, "value": action.newData[nd] }
                        }).filter(f => f)
                    }).flat()
                    const newFil = {
                        ...fil,
                        "attributes": newAttributes
                    }
                    return newFil
                }
                return fil
            })
            return newState
        }
        if (action?.type === "updateData2" && action?.newData && action?.title) {
            let contador = 0;
            let newState = state.map(s => {
                if (s.category in action.newData["meta"]) {
                    const newAttributes = s["attributes"].map(i => {
                        let data = Object.keys(action.newData["meta"][s.category][contador]).map(nd => {
                            if (nd === i.attribute)  {
                                let helper = { ...i, "value": action.newData["meta"][s.category][contador][nd] }
                                return helper
                            }
                        }).filter(f => f)
                        return data
                    }).flat()
                    const newS = {
                        ...s,
                        "attributes": newAttributes
                    }
                    contador = contador + 1;
                    return newS
                }
                return s
            })
            return newState
        }
    }
    const [fixedData, disFixedData] = useReducer(fixReducer, [])
    //TODO -----------------------------------------------------------------------------

    const fixDataHandler = (StructData) => {
        //* Fixin the structure
        let cat = StructData.map(a => a.categories).flat()
        let fix = cat.map(sa => {
            let helperAttr = sa.attributes.map(t => { return { "label": t.label, "attribute": t.attribute, "value": "" } })
            const helper = {
                "category": sa.category,
                "category_label": sa.category_label,
                "attributes": helperAttr
            }
            return helper
        })
        disFixedData({ "type": "setup", "data": fix })
        fix.map(dat => {
            setDuplicator(prev => ({
                ...prev,
                [dat.category]: dat
            }))
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            await Service.Structure.getStructure().then(response => {
                if (response?.data?.pages) {
                    setStructure(response.data.pages)
                    fixDataHandler(response.data.pages)
                }
            })
        }
        fetchData()
    }, [])

    const HandleSubmit = (event, arr) => {
        event.preventDefault();

        if (pagePos === 0) {
            const submitFirstPart = async (obj) => {
                let res = await Service.Project.submitBasicInfo(obj, user.token)
                if (res?.status === "success") {
                    disDataToSend({ "type": "setnew", "data": res.data})
                    disFixedData({ "type": "updateData", "newData": obj, "title": arr[0].category_label })
                    setPagePos(prev => prev + 1)
                }
            }
            submitFirstPart(dataToSend.data)
            return
        }

        if (pagePos <= structure.length-1) {
            const submitSecondPart = async (obj) => {
                let res = await Service.Project.submitBasicInfo(obj, user.token)
                if (res?.status === "success") {
                    disFixedData({ "type": "updateData2", "newData": obj, "title": arr[0].category_label })
                    setPagePos(prev => prev + 1)
                }
                return
            }
            submitSecondPart(dataToSend.data)

            if (pagePos === structure.length-1) {
                setFinal(true)
                return
            }
            return
        }
    }

    const addCategorie = (cat) => {
        setStructure(prevStructure => {
            const copyData = [...prevStructure]
            copyData[pagePos] = {
                ...copyData[pagePos],
                categories: [...copyData[pagePos].categories, cat]
            }

            return copyData
        })
        disFixedData({ "type": "duplicate", "category": cat.category })
    }

    const handlePolygonData = (data, category) => {
        polygonDataRef.current = [data]
        disDataToSend({ "type": "update", "input": { "name": data.attribute, "value": data.coords, "index": data.index, "category": category } })
    }

    const inputsHandler = (event, category) => {
        const {name = "", value = "", index = null} = (event?.target ? event.target : event) ?? {}
        const customAttribute = event?.target?.getAttribute("data-categorie-index") ?? null
        const customName = event?.target?.getAttribute("data-name") ?? null

        let validIndex = index === null ? Number(customAttribute) : Number(index)

        const validName = customName ?? name

        disDataToSend({ "type": "update", "input": { "name": validName, "category": category, "index": validIndex, "value": value } })
    }

    const FormMaker = () => {
        if (structure.length == 0) return <div></div>
        let page = structure[pagePos]
        let categoriePos = page?.categories?.length ?? 0

        return (
            <form onSubmit={(e) => HandleSubmit(e, page?.categories)} id={create_style["form"]}>
                <h1 onClick={() => console.log(dataToSend)}>{page?.page_title}</h1>
                <hr />
                <div className={create_style["categores_flex_div"]}>
                    {
                        page?.categories?.map((cat, key) => (
                            <div key={`categorie-${key}`} className={create_style["form_categories"]}>
                                <h2>{cat.category_label}</h2>
                                <div>
                                    {
                                        cat?.attributes?.map((attr, index) => (
                                            <FormHelper
                                                attr={{ ...attr, formControllerIndex: key, category: cat?.category }}
                                                savedData={dataToSend.dataInputs}
                                                inputsCallback={inputsHandler}
                                                callback={handlePolygonData}
                                                key={`formhelper-${index}`} />
                                        ))
                                    }
                                </div>
                                {cat.multirow && key === categoriePos - 1 && <button type="button" className={create_style["addmore_create"]} onClick={() => addCategorie(cat)}>add more</button>}
                            </div>
                        ))
                    }
                </div>
                <button type="submit">Continue</button>
            </form>
        )
    }

    const miaycoco = async () => {
        let res = await Service.Project.confirmsubmit(dataToSend.data._id, user.token)
        if (res.name === "AxiosError") {
            Swal.fire({
                title: "oops...",
                text: res.response?.data?.error?.message,
            }).then(() => window.location.reload())
            return
        }
        Swal.fire({
            title: "its Okey",
            text: "project verified",
        })
    }

    const FinalPage = () => {
        return (
            <div className={create_style["final_page"]}>
                <h1 onClick={() => console.log(dataToSend)}>New Project</h1>
                <hr />
                <div className={create_style["fp_container"]}>
                    {
                        fixedData.map((categories, id) => (
                            <div key={`finalpage-${id}`} className={create_style["fp_categories"]}>
                                <input type="checkbox" name={categories.category} id={`${categories.category}-${id}`} />
                                <label htmlFor={`${categories.category}-${id}`}>
                                    {categories?.category_label}
                                </label>
                                <div className={create_style["fp_info_container"]}>
                                    {
                                        categories["attributes"].map((attr, id2) => (
                                            <>
                                                {
                                                    attr.attribute === "production_area_polygon"
                                                        ? <div key={`${attr.attribute}-modedpoly-${id}-${id2}`} className={create_style["fp_info_mappoly"]}>
                                                            <h4>{attr?.label}</h4>
                                                            <MapPolygon info={attr} />
                                                        </div>
                                                        : <div key={`${attr.attribute}-${id}-${id2}`} className={create_style["fp_info_div"]}>
                                                            <h4>{attr?.label}</h4>
                                                            {
                                                                attr?.value && Array.isArray(attr.value)
                                                                    ? <span>{attr.value.join(", ")}</span>
                                                                    : <span>{attr?.value}</span>
                                                            }
                                                        </div>
                                                }
                                            </>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <button onClick={() => miaycoco()}>Create Project</button>
            </div>
        )
    }

    return (
        <div id={create_style["whiteContainer"]}>
            {
                final
                    ? <FinalPage />
                    : FormMaker()
            }
        </div>
    )
}