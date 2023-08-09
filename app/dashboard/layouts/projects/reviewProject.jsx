import {
	AccordionBody,
	AccordionHeader,
	AccordionItem,
	Button,
	ModalBody, ModalFooter,
	ModalHeader,
	UncontrolledAccordion
} from 'reactstrap';
import create_style from '@/app/dashboard/layouts/create/create.module.scss';
import MapPolygon from '@/app/dashboard/components/mod-polygon/modedPolygon';
import React, { useEffect, useState } from 'react';
import project_styles from '@/app/dashboard/layouts/projects/projects.module.scss';
import {Modal, Input} from 'reactstrap';
export default ({projectData, structure, validateProject, declineProject, user}) => {
	const [rejectModalShow, setRejectModalShow] = useState(false);
	const [rejectMessage, setRejectMessage] = useState("");
	const [curStructure, setCurStructure] = useState([]);
	const toggle = () => setRejectModalShow(!rejectModalShow);
	const handleChangeRejectMessage = (e) => {
		setRejectMessage(e.target.value);
	}


	useEffect(() => {
			const temp = structure[1];
			const categoryCount = temp?.categories?.length || 0;
			const category = temp?.categories[0]?.category;
			const count = projectData.metadata?.[category]?.length || 0;
			for(let i = 0; i < count - categoryCount; i++) {
				temp?.categories.push(temp?.categories[0]);
			}
			setCurStructure([...[structure[0]], ...[temp]]);
	}, []);
	return (
		<>
			<div className={project_styles['title_cont']}>
				<p>Please review the information bellow</p>
				{ user.role === "vvb" && projectData?.status === "submitted" && <div>
					<p>
						<span>cloud_download</span>download
					</p>
					<button className={project_styles['cancelBtn']} onClick={setRejectModalShow}>
						Decline
					</button>
					<Modal isOpen={rejectModalShow} toggle={toggle} centered>
						<ModalHeader toggle={toggle}>Reject Message</ModalHeader>
						<ModalBody>
							<Input rows={4} onChange={handleChangeRejectMessage} type={'textarea'} />
						</ModalBody>
						<ModalFooter>
							<Button color='primary' onClick={() => {
								toggle();
								declineProject(rejectMessage);
							}}>
								Decline
							</Button>{' '}
							<Button color='secondary' onClick={toggle}>
								Cancel
							</Button>
						</ModalFooter>
					</Modal>
					<button /*onClick={() => validate(metaData._id)}*/ onClick={validateProject}>Validate</button>
				</div>}
			</div>
			<UncontrolledAccordion stayOpen defaultOpen={['1']}>
				<AccordionItem style={{ marginTop: 52 }}>
					<AccordionHeader targetId='1' className={create_style['accordion-title']}>
						PROJECT INFORMATION
					</AccordionHeader>
					<AccordionBody accordionId='1'>
						<div className='row'>
							{
								curStructure[0]?.categories[0]?.attributes.map((item, index) => {
									return (
										<div className='col-md-12' key={index}>
											<div className={create_style['review-attribute-title']}>{item.label}</div>
											<div
												className={create_style['review-attribute-value']}>{projectData.metadata?.['project_information']?.[item.attribute]}</div>
										</div>
									);
								})
							}
						</div>
					</AccordionBody>
				</AccordionItem>
			</UncontrolledAccordion>
			<UncontrolledAccordion stayOpen defaultOpen={['1']}>
				<AccordionItem style={{ marginTop: 52 }}>
					<AccordionHeader targetId='1' className={create_style['accordion-title']}>
						PRODUCTION AREAS
					</AccordionHeader>
					<AccordionBody accordionId='1'>
						{
							curStructure[1]?.categories.map((category, index) => {
								return (
									<div className='row' key={index}>
										{
											category?.attributes?.map((attribute, key) => {
												return (
													<div className={attribute.type === 'LocationPolygon' ? 'col-md-12' : 'col-md-3'} key={key}>
														<div className={create_style['review-attribute-title']}>{attribute.label}</div>
														<div>
															{
																attribute.type === 'LocationPolygon' ? <MapPolygon
																		info={{ value: projectData?.metadata?.['production_areas']?.[index]?.[attribute.attribute] }} /> :
																	<div
																		className={create_style['review-attribute-value']}>{projectData?.metadata?.['production_areas']?.[index]?.[attribute.attribute]}</div>
															}
														</div>
													</div>
												);
											})
										}
									</div>
								);
							})
						}

					</AccordionBody>
				</AccordionItem>
			</UncontrolledAccordion>
		</>
	);
}