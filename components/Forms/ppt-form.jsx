import React, { FormEventHandler, useEffect, useState } from "react";
import { useRef } from "react";
import Element from "../Element";
import ICONS from "@/assets/icons/icons";

export default function DynamicForm({ coordsInit, deleteForm, metadata, pageInfo, setPageInfo, formStep, nextFormStep, prevFormStep, pageIndex, addNewForm, updateInfo, userRole }) {
    const [elements, setElements] = useState(null);
    const [formCategory, setFormCategory] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            updateInfo();
            nextFormStep();

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        setFormCategory(pageInfo)
    }, [])

    // console.log('Form', formCategory)
    const { categories, page_title, atributes } = formCategory ?? {}

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {categories ? categories.map((category, index) =>
                    <div key={index}>
                        {category.multirow === true ?
                            <>
                                {Array(...category.attributes).map((item2, index2) => (
                                    <div id={`${category.category}&${index2}`} key={index2}>
                                        <div className="icon_reseed_container_form" >
                                            <p className="approval_tittle">{category.category_label}</p>
                                            <img src={ICONS.can.src} alt="can" onClick={(e) => {e.preventDefault(); deleteForm(`${category.category}&${index2}`)}} />
                                        </div>
                                        <div className="row">
                                            {Array(...item2).map((item3, index3) => (
                                                <>
                                                    < Element userRole={userRole} coordsFormMaps={coordsInit} indexPerObject={index2} arrayFlag={true} key={index3} atribute={item3} name={item3.attribute} metadata={metadata} category={category} />
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                            :
                            <>
                                <div className="icon_reseed_container_form">
                                    <p className="approval_tittle">{category.category_label}</p>
                                </div>
                                <div className="row">
                                    {Array(...category.attributes).map((atribute, i) =>
                                        <Element userRole={userRole} arrayFlag={false} key={i} atribute={atribute} metadata={metadata} category={category} />)}
                                </div>

                            </>
                        }
                        {category.multirow === true ?
                            <div className="d-flex justify-content-end">
                                <button className="btn_add_new" onClick={(e) => { e.preventDefault(); console.log('se dispara button -->'); addNewForm(pageIndex, category, index) }}>
                                    + Add New Project Manager
                                </button>
                            </div>
                            : null
                        }


                    </div>
                )
                    : null
                }
                <div className="container_btns_form">
                    {formStep > 0 && (
                        <button
                            className='btn_back_form'
                            onClick={prevFormStep}
                            type="button"
                        >
                            Back
                        </button>
                    )}

                    <button className="btn_continue_form" type="submit">Continue</button>
                </div>
            </form>
        </div>
    )
}