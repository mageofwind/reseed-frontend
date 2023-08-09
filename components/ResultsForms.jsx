import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Swal from 'sweetalert2';
import MapView from './Elements/Map';
import { submitForm } from './Elements/service/submitForm.service';
import ls from "@/utils/localStorage/ls";

export default function Results({ formStep, prevFormStep, pageInfo, coordsFromPage, isLoading }) {
    const componentRef = useRef();
    const [results, setResults] = useState([]);
    const [user, setUser] = useState({});

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Registration Info',
        onAfterPrint: () => alert('Print Success')
    })

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            Swal.fire({
                imageUrl: 'https://reseed.farm/wp-content/uploads/2023/03/Logo-Reseed-Green.svg',
                imageHeight: 60,
                imageWidth: 160,
                title: '',
                text: 'Are you sure the information provided is correct ?',
                cancelButtonText: 'No',
                confirmButtonText: 'Yes and Submit',
                showCancelButton: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (user.role === 'pp' || user.role === 'vvb' || user.role === 'custom') {
                        let useriD = user._id;
                        let userRol = user.role
                        const submitResponse = await submitForm(useriD, userRol)
                        if (submitResponse.status === 'success') {
                            Swal.fire({
                                icon: 'success',
                                text: `${submitResponse.message}`
                            }).then(()=> {
                                location.href = '/';
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: 'There was a problem to submit your form'
                            })
                        }
                    }
                    // if (user.role === 'vvb') {
                    //     let useriD = user._id;
                    //     let userRol = user.role
                    //     const submitResponse = await submitForm(useriD, userRol)
                    //     if (submitResponse.status === 'success') {
                    //         Swal.fire({
                    //             icon: 'success',
                    //             text: `${submitResponse.message}`
                    //         })
                    //     } else {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             text: 'There was a problem to submit your form'
                    //         })
                    //     }
                    // }
                }
            })
                ;
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        let userResponse = ls.getStorage("user")
        if (userResponse) {
            setUser(userResponse);
        }
        let sebo = [];
        Array(...pageInfo).map((item, index) => {
            let objectToUse = {
                "title": item.page_title,
                "categories": []
            };
            Array(...item.categories).map((item2, index2) => {

                let content = {
                    "category_label": item2.category_label,
                    "multirow": false,
                    "results": []
                };
                if (item2.multirow) {
                    content.multirow = true;
                    Array(...item2.newInsert).map((item3, index3) => {

                        // console.log('item 3 we multirow ->', item3);
                        let value;
                        if (item3.type === "StaticList") {
                            let e = [...document.getElementsByName(item3.attribute)];
                            e.map((selectcontent, selectcontentindex) => {
                                let valuesExist = [...content.results[selectcontentindex] ?? []];
                                valuesExist.push({
                                    'value': selectcontent.options[selectcontent.selectedIndex].value,
                                    'label': item3.label
                                });
                                content.results[selectcontentindex] = valuesExist;
                            })
                        } else if (item3.type === "MultiSelectList") {

                            
                        } else {
                            value = [...document.getElementsByName(item3.attribute)];
                            value.map((inputcontent, inputcontentindex) => {
                                let valuesExist = [...content.results[inputcontentindex] ?? []];
                                valuesExist.push({
                                    'value': inputcontent.value,
                                    'label': item3.label
                                });
                                content.results[inputcontentindex] = valuesExist;
                            });

                        }
                    })
                    // console.log('contenido final test ->', content);
                } else {
                    Array(...item2.attributes).map((item3, index3) => {
                        let value;
                        // console.log('item 3 we ->', item3);
                        if (item3.type === "StaticList") {
                            let e = document.getElementById(item3.attribute);
                            value = e.options[e.selectedIndex].text;
                        } else if (item3.type === "MultiSelectList") {
                            // console.log('es el multi select ->', document.getElementsByName(item3.attribute));
                            let valuesMultiSelectList = [...document.getElementsByName(item3.label)];
                            valuesMultiSelectList.map((inputMultiSel, inputMultiSelIndex) => {
                                if (value === undefined) {
                                    return value = inputMultiSel?.value;
                                }
                                if (value !== "" && Number(inputMultiSelIndex + 1) < valuesMultiSelectList.length) {
                                    value = `${value}, ${inputMultiSel?.value}`
                                }
                                if (value !== "" && Number(inputMultiSelIndex + 1) === valuesMultiSelectList.length) {
                                    value = `${value} and ${inputMultiSel?.value}.`
                                }
                            })
                        } else {
                            value = document.getElementById(item3.attribute)?.value;
                        }

                        // console.log(`value ${item3.attribute} ->`, value);
                        content.results.push({
                            "value": value ?? "",
                            "label": item3.label
                        });
                    });
                }

                objectToUse.categories.push(content);
            });
            // console.log('obtect to use ->', objectToUse);
            sebo.push(objectToUse);
        });
        // console.log('sebo we ->', sebo)
        setResults(sebo);

    }, []);
    return (
        <>
            <div className="pdf_container">
                <button className="download_btn" onClick={handlePrint} variant="success">Download to PDF</button>
            </div>

            <div className='formCard' ref={componentRef}>

                <form onSubmit={handleSubmit}>
                    <p className="result_title mt-5">Please review the information bellow to complete the registration</p>
                    {results.length > 0 && results.map((item, index) => (
                        <div key={index}>
                            {/* <p className="result_categoryName">{item.title}</p> */}
                            {Array(...item.categories).map((item2, index2) => (
                                <div key={index2}>
                                    <>
                                        {!item2.multirow &&
                                            <div className="result_category">
                                                <p className="result_categoryName">{item2.category_label}</p>
                                                <div className="row row-cols-1 row-cols-md-2">
                                                    {Array(...item2.results).map((item3, index3) => (
                                                        <div key={index3} className="col result_container">
                                                            <p className="result_label">{item3.label}</p>
                                                            <p className="result_response">{item3.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        }
                                        {item2.multirow &&
                                            <>
                                                {Array(...item2.results).map((item3, index3) => {
                                                    return (
                                                        <div className="result_category" key={index3}>
                                                            <p className="result_categoryName">{index3 + 1}- {item2.category_label}</p>
                                                            <div className="row row-cols-1 row-cols-md-2">
                                                                {Array(...item3).map((item4, index4) => (
                                                                    <div key={index4} className="col result_container">
                                                                        <p className="result_label">{item4.label}</p>
                                                                        <p className="result_response">{item4.value}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {!isLoading &&
                                                                <div className="row">
                                                                    <MapView indexMap={index3} coords={coordsFromPage} />
                                                                </div>
                                                            }
                                                        </div>

                                                    );
                                                })}
                                            </>
                                        }
                                    </>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="container_btns_form no-print">
                        {formStep > 0 && (
                            <button
                                className='btn_back_form'
                                onClick={prevFormStep}
                                type="button"
                            >
                                Back
                            </button>
                        )}
                        <button className="btn_continue_form no-print" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );

}