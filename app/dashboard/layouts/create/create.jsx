"use client"
import Service from '@/utils/api/services';
import React, { useEffect, useState } from 'react';
import { UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap';
import FormHelper from '@/app/dashboard/layouts/create/formHelper';
import create_style from '@/app/dashboard/layouts/create/create.module.scss';
import ls from '@/utils/localStorage/ls';
import MapPolygon from '@/app/dashboard/components/mod-polygon/modedPolygon';
import Spinner from '../../components/spinner/spinner';
import Swal from 'sweetalert2';

export default ({ user }) => {
    const [structure, setStructure] = useState([]);
    const [loading, setLoading] = useState({ loading: false, text: "Loading", id: "load" });
    const [pagePos, setPagePos] = useState(-1)
    const [isFinal, setFinal] = useState(false);
    const [projectData, setProjectData] = useState({ status: "pending", metadata: {}});
    const [currentPageStructure, setCurrentPageStructure] = useState({});

    useEffect(() => {
        fetchPageData();
        setProjectData(ls.getStorage('project') || {});
    }, []);

    useEffect(() => {
        const final = structure.length <= pagePos;
        if(!final) {
            const temp = structure[pagePos];
            const categoryCount = temp?.categories?.length || 0;
            const category = temp?.categories[0]?.category;
            const count = projectData.metadata?.[category]?.length || 0;
            for(let i = 0; i < count - categoryCount; i++) {
                temp?.categories.push(temp?.categories[0]);
            }
            setCurrentPageStructure(temp);
        }
        setFinal(final);
    }, [pagePos, pagePos]);

    const fetchPageData = () => {
        setLoading({loading: true, text: "Loading...", id: "load"});
        Service.Structure.getStructure()
            .then((data) => {
                if(data?.data?.pages) {
                    setPagePos(0);
                    setStructure(data.data.pages);
                }
                setLoading({loading: false, text: "Loading...", id: "load"})
            })
          .catch(() => {
                setLoading({loading: false, text: "Loading...", id: "load"})
            });
    }

    const handleInputChange = (value, info) => {
        const {category, attribute} = info;
        let metadata = projectData?.metadata || {};
        if(!pagePos) {
            const saveData = metadata[category] || {};
            metadata = {...metadata, [category]: { ...saveData, [attribute] : value }};
        } else {
            const saveData = metadata[category] || [];
            let rowData = saveData[info.formControllerIndex] ? saveData[info.formControllerIndex] : {};
            rowData = { ...rowData, [attribute] : value };
            saveData[info.formControllerIndex] = rowData;
            metadata = {...metadata, [category]: saveData }
        }
        setProjectData({ ...projectData, metadata});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading({loading: true, text: "Saving...", id: "save"});
        if(!isFinal) {
            const sendData = {
                ...projectData.metadata,
                status: projectData?.status,
                ppId: projectData?.ppId,
                _id: projectData?._id
            }
            let res = await Service.Project.submitBasicInfo(sendData, user.token);
            if (res?.status === 'success') {
                setProjectData(res.data);
                setPagePos((prev) => prev + 1);
            }
            setLoading({loading: false, text: "Saving...", id: "save"})
        }
    }

    const submitProject = async () => {
        setLoading({loading: true, text: "Submitting...", id: "submit"});
        Service.Project.confirmsubmit(projectData?._id, user.token)
          .then(() => {
              Swal.fire({
                  title: 'its Okay',
                  text: 'project submitted'
              }).then(() => {
                  window.location.pathname = '/dashboard'
              });
              setLoading({loading: false, text: "Submitting...", id: "submit"});
          })
          .catch((e) => {
              Swal.fire({
                  title: 'oops...',
                  text: "Server Error"
              })
              setLoading({loading: false, text: "Submitting...", id: "submit"});
          });
    }
    const addCategory = (category) => {
        const data = { ...currentPageStructure };
        data?.categories.push(category);
        setCurrentPageStructure(data);
    }

    const goPrevPage = () => {
        setPagePos((prevState) => prevState - 1);
    };

    return (
        <div className='bg-white h-100 p-5 position-relative'>
            {
              loading.loading && <Spinner text={loading.text} />
            }
            <div
                className={`d-flex flex-row justify-content-between align-items-center ${create_style['title-container']}`}>
                <h2>{isFinal? 'Review Project' : currentPageStructure?.page_title}</h2>
                {pagePos ? <a style={{ cursor: 'pointer', color: '#9E977F' }}
                              onClick={() => goPrevPage()}>{'< Back to Form'}</a> : ''}
            </div>
            <div className='divider'></div>
            {
                isFinal ?
                    <>
                        <UncontrolledAccordion stayOpen defaultOpen={['1']} >
                            <AccordionItem style={{marginTop: 52}}>
                                <AccordionHeader targetId="1" className={create_style['accordion-title']}>
                                    PROJECT INFORMATION
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <div className="row">
                                        {

                                            structure[0]?.categories[0]?.attributes.map((item, index) => {
                                                  return (
                                                    <div className="col-md-12" key={index}>
                                                        <div className={create_style['review-attribute-title']}>{item.label}</div>
                                                        <div className={create_style['review-attribute-value']}>{projectData.metadata?.['project_information']?.[item.attribute]}</div>
                                                    </div>
                                                  )
                                                })
                                        }
                                    </div>
                                </AccordionBody>
                            </AccordionItem>
                        </UncontrolledAccordion>
                        <UncontrolledAccordion stayOpen defaultOpen={['1']}>
                            <AccordionItem style={{marginTop: 52}}>
                                <AccordionHeader targetId="1" className={create_style['accordion-title']}>
                                    PRODUCTION AREAS
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    {
                                        structure[1]?.categories.map((category, index) => {
                                            return (
                                              <div className="row" key={index}>
                                                  {
                                                      category?.attributes?.map((attribute, key) => {
                                                          return (
                                                            <div className={attribute.type === "LocationPolygon" ? "col-md-12" : "col-md-3"} key={key}>
                                                                <div className={create_style['review-attribute-title']}>{attribute.label}</div>
                                                                <div>
                                                                    {
                                                                        attribute.type === "LocationPolygon" ? <MapPolygon info={{value: projectData?.metadata?.['production_areas']?.[index]?.[attribute.attribute]}} /> : <div className={create_style['review-attribute-value']}>{projectData?.metadata?.['production_areas']?.[index]?.[attribute.attribute]}</div>
                                                                    }
                                                                </div>
                                                            </div>
                                                          )
                                                      })
                                                  }
                                              </div>
                                            )
                                        })
                                    }
                                </AccordionBody>
                            </AccordionItem>
                        </UncontrolledAccordion>
                        <div className="d-flex justify-content-end">
                            <button onClick={() => submitProject()} className={create_style['submit-button']}>Submit</button>
                        </div>
                    </>
                :
                    <form onSubmit={(e) => handleSubmit(e, currentPageStructure?.categories)} id={create_style['form']}>

                        <div className='pt-4'>
                            {
                                currentPageStructure?.categories?.map((category, key) => (
                                    <div key={key}>
                                        <div className={create_style['form-category-title']}>
                                            {category?.category_label}
                                        </div>
                                        {
                                            category?.attributes.map((attribute, index) => (
                                              <div className={create_style['form-element']} key={index}>
                                                  <FormHelper
                                                    attr={{ ...attribute, formControllerIndex: key, category: category?.category, value: projectData?.metadata?.['production_areas']?.[key]?.[attribute.attribute] }}
                                                    projectData={projectData.metadata}
                                                    handleInputChange={handleInputChange}
                                                    key={`formhelper-${key}-${index}`}
                                                  />
                                              </div>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                            {
                              pagePos === 1 && !isFinal && currentPageStructure?.categories?.length > 0 &&(
                                <button type='button' className={`${create_style['addmore_create']}`} onClick={() => addCategory(currentPageStructure?.categories[0])}>
                                    add more
                                </button>
                              )
                            }
                        </div>
                        <button type='submit' className={create_style['submit-button']}>Continue<span
                            className='material-symbols-outlined ms-1'>arrow_forward_ios</span></button>
                    </form>
            }
        </div>
    )
}