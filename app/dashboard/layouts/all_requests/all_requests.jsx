"use client"
import React, { useEffect, useState } from "react";
import request_styles from "./all_requests.module.scss"
import DataGrid from 'react-data-grid';
import { jsPDF } from "jspdf";
import ICONS from "@/assets/icons/icons";
import Service from "@/utils/api/services";
import Helper from "./helper"
import MapView from "@/components/Elements/Map";
import Spinner from '../../components/spinner/spinner';

export default function AllRequests({ user, catSelected, data, countData }) {
    const [requestSelected, setRequestSelected] = useState({ "state": false, "req": {} })
    const [showPopUp, changePopUp] = useState({ "approve": false, "denied": false })
    const [textAreaValue, setValue] = useState("")
    const [sortColumn, setSortColumn] = useState([]);
    const [loading, setLoading] = useState({loading: false, text: "Loading..."});

    useEffect(() => {
        if (requestSelected.state) setRequestSelected(prev => ({ ...prev, "state": false }))
    }, [catSelected])

    const columns = [
        { key: 'rol', name: 'Rol', sortable: false },
        { key: 'id', name: 'ID', sortable: false },
        { key: 'email', name: 'Email', sortable: false },
        { key: 'status', name: 'Status', sortable: true },
        { key: 'action', name: 'Action', sortable: false },
    ]

    const applyRequestSelected = async (id) => {
        let reqDetails = await Service.Requests.getDetails(id)
        setRequestSelected(prev => ({ ...prev, "state": true, "req": { ...reqDetails?.data } }))
    }

    const Actions = (props) => {
        props.action = <p onClick={() => applyRequestSelected(props.id)} className={request_styles["eye"]} >visibility</p>

        if (props.status === "pending") props.status = (<p className={request_styles["status_pending"]}>{props.status}</p>)
        if (props.status === "declined") props.status = (<p className={request_styles["status_declined"]}>{props.status}</p>)
        if (props.status === "approved") props.status = (<p className={request_styles["status_approved"]}>{props.status}</p>)
    }

    const rows = () => {
        let dataToUse
        if (catSelected === 2) { dataToUse = data["all"] }
        if (catSelected === 2.1) { dataToUse = data["vvb"] }
        if (catSelected === 2.2) { dataToUse = data["pp"] }

        let table = dataToUse.map(r => {
            const item = {
                "rol": r.role ?? "",
                "id": r._id ?? "",
                "email": r.email ?? "",
                "status": r.status ?? "",
                "action": ""
            }
            return item
        })

        return table
    }

    const handleSort = (props) => {
        const { columnKey, direction } = props[0] ?? { columnKey: "", direction: "" }

        const asc = (dataToSort) => {
            const sortedData = dataToSort.sort((a, b) => {
                if (a[columnKey] < b[columnKey]) return -1
                if (a[columnKey] > b[columnKey]) return 1
                return 0
            })
            setSortColumn([props[0], ...sortedData])
        }
        const desc = (dataToSort) => {
            const sortedData = dataToSort.sort((a, b) => {
                if (a[columnKey] < b[columnKey]) return 1
                if (a[columnKey] > b[columnKey]) return -1
                return 0
            })
            setSortColumn([props[0], ...sortedData])
        }

        if (catSelected === 2) {
            if (direction.toLowerCase() === "asc") return asc(data["all"])
            if (direction.toLowerCase() === "desc") return desc(data["all"])
            return setSortColumn(null)
        }
        if (catSelected === 2.1) {
            if (direction.toLowerCase() === "asc") return asc(data["vvb"])
            if (direction.toLowerCase() === "desc") return desc(data["vvb"])
            setSortColumn([])
        }
        if (catSelected === 2.2) {
            if (direction.toLowerCase() === "asc") return asc(data["pp"])
            if (direction.toLowerCase() === "desc") return desc(data["pp"])
            setSortColumn([])
        }
    }

    const rightCountData = () => {
        if (catSelected === 2) return countData["all"]
        if (catSelected === 2.1) return countData["vvb"]
        if (catSelected === 2.2) return countData["pp"]
    }

    const FrontLayout = () => {
        return (
            <div className='bg-white h-100 p-5 position-relative'>
                <div className={request_styles["title_div"]}>
                    <h1>Request</h1>
                    <p className={request_styles["title_pending"]}><img src={ICONS.exclametion_orange.src} alt="exclametion" /> PENDING <span>{rightCountData()}</span></p>
                </div>
                <hr />
                <div className={'position-relative'}>
                    {
                      loading.loading && <Spinner text={loading.text} type={{marginTop: 60}}/>
                    }
                    <DataGrid
                      columns={columns}
                      rows={rows()}
                      rowKeyGetter={Actions}
                      headerRowHeight={60}
                      rowHeight={50}
                      sortColumns={sortColumn}
                      onSortColumnsChange={handleSort} />
                </div>

            </div>
        )
    }

    const denied = () => Service.Requests.Denied(requestSelected.req._id, user.token, textAreaValue)
    const approved = () => Service.Requests.Approved(requestSelected.req._id, user.token)

    const HandleApprove = () => {
        return (
            <div className={request_styles["popup"]}>
                <div>
                    <img src={ICONS.ressed_icon.src} alt="logod" />
                    <p>Are you sure you want to approve this information?</p>
                    <div>
                        <button className={request_styles["popup_cancel"]} onClick={() => changePopUp(prev => ({ ...prev, "denied": false, "approve": false }))} >Cancel</button>
                        <button className={request_styles["popup_continue"]} onClick={() => {
                            approved()
                            changePopUp(prev => ({ ...prev, "denied": false, "approve": false }))
                        }}>Yes and Approve</button>
                    </div>
                </div>
            </div>
        )
    }
    const HandleDenie = () => {
        return (
            <div className={request_styles["popup"]}>
                <div>
                    <img src={ICONS.ressed_icon.src} alt="logod" />
                    <h4>Explain the reasons of the application being rejected:</h4>
                    <p>Provide a clear and concise explanation for the rejection of the application.</p>
                    <textarea onChange={(e) => setValue(e.target.value)} name="reason" id="" cols="30" rows="10"></textarea>
                    <div>
                        <button className={request_styles["popup_cancel"]} onClick={() => changePopUp(prev => ({ ...prev, "denied": false, "approve": false }))} >Cancel</button>
                        <button className={request_styles["popup_continue"]} onClick={() => {
                            denied()
                            changePopUp(prev => ({ ...prev, "denied": false, "approve": false }))
                        }}>Send message</button>
                    </div>
                </div>
            </div>
        )
    }
    const generatePDF = () => {
        const report = new jsPDF({
            orientation: "portrait",
            unit: "cm",
            format: "letter"
        })
        report.html(document.querySelector('#divtoPdf')).then(() => {
            report.save();
        })
    }

    const InternalLayout = () => {
        let req = requestSelected.req
        console.log("req", req)
        let meta = req.meta ?? {}

        const backToAll = () => setRequestSelected(prev => ({ ...prev, "state": false }))

        const denied = () => changePopUp(prev => ({ ...prev, "denied": true, "approve": false }))
        const approved = () => changePopUp(prev => ({ ...prev, "approve": true, "denied": false }))

        return (
            <div id="divtoPdf" className='bg-white h-100 p-5 position-relative'>
                {
                  loading.loading && <Spinner text={loading.text} type={{marginTop: 60}}/>
                }
                <h1>{req?.meta?.corporate_information?.company_legal_name ?? "Not a Valid Data"}</h1>
                <hr />
                <div className={request_styles["options_div"]}>
                    <p onClick={() => backToAll()}><span>arrow_back_ios</span>Back to All Requests</p>
                    <div className={request_styles["options_buttons"]}>
                        <p onClick={() => generatePDF()}><span>download</span>Download PDF</p>
                        {
                            ["declined", "approved"].includes(req?.status)
                                ? <></>
                                : <>
                                    <button
                                        type="button"
                                        className={request_styles["denied"]}
                                        onClick={() => denied()} >Denied</button>
                                    <button
                                        type="button"
                                        className={request_styles["approve"]}
                                        onClick={() => approved()} >Approve</button>
                                </>
                        }
                    </div>
                </div>
                <div className={request_styles["content"]}>
                    {
                        Helper.getCategories(meta).map((categories, key) => {
                            if (Helper.verifyArrJson(meta) === "object") {
                                return (
                                    <div key={key} className={request_styles["accordion"]}>
                                        <label htmlFor={`chbx-${key}`} className={request_styles["checkbox_accordion"]}>
                                            {Helper.fixText(categories)}
                                            <span>expand_more</span>
                                        </label>
                                        <input type="checkbox" name={`chbx-${key}`} id={`chbx-${key}`} defaultChecked />
                                        <div>
                                            {
                                                Helper.getCategories(meta[categories]).map((subcategories, key) => {
                                                    if (Helper.verifyArrJson(meta[categories]) === "object") {
                                                        return (
                                                            <div key={key} className={request_styles["grid_div"]}>
                                                                <h4>{Helper.fixText(subcategories)}</h4>
                                                                {
                                                                    Helper.verifyArrJson(meta[categories][subcategories]) === "array" &&
                                                                    <p>{meta[categories][subcategories].join(", ")}</p>
                                                                }
                                                                {
                                                                    Helper.verifyArrJson(meta[categories][subcategories]) === "any" &&
                                                                    <p>{meta[categories][subcategories]}</p>
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                    if (Helper.verifyArrJson(meta[categories]) === "array") {
                                                        if (Helper.verifyArrJson(subcategories) === "object") {
                                                            return (
                                                                <div key={key} className={request_styles["map_div"]}>
                                                                    {
                                                                        Object.keys(subcategories).map((dir, key) => {
                                                                                // console.log(dir, subcategories);
                                                                            if (dir === "region_of_operation") {
                                                                                return (
                                                                                    <div key={key} className={request_styles["map_map"]}>
                                                                                        <h4>{Helper.fixText(dir)}</h4>
                                                                                        <MapView coords={subcategories[dir]} indexMap={key} />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <>
            {showPopUp.approve && <HandleApprove />}
            {showPopUp.denied && HandleDenie()}
            {
                requestSelected.state
                    ? InternalLayout()
                    : FrontLayout()
            }
        </>
    )
}