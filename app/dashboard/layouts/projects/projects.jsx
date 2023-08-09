'use client'

import React, { useEffect, useState } from 'react';

import 'react-data-grid/lib/styles.css';
import PpProject from './pp_projects';

import 'react-data-grid/lib/styles.css';
import project_styles from './projects.module.scss';
import Service from '@/utils/api/services';
import VvbProjects from '@/app/dashboard/layouts/projects/vvb_projects';
import AdminProjects from '@/app/dashboard/layouts/projects/admin_projects';
import ls from '@/utils/localStorage/ls';
import Spinner from '@/app/dashboard/components/spinner/spinner';
import Swal from 'sweetalert2';
import ReviewProject from '@/app/dashboard/layouts/projects/reviewProject';
import { message } from 'antd';

export default ({ user, handlerNewProject, handlerNewReport }) => {
	const [projects, setProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null)
	const [loading, setLoading] = useState({loading: false, text: "Loading..."});
	const [structure, setStructure] = useState([]);

	useEffect(() => {
		fetchProjects()
	}, []);
	const fetchProjects = async () => {
		setLoading({ loading: true, text: "Loading..." })
		Service.Project.fetchProjects(user.token).then((data) => {
			if(!!data) setProjects(data.data);
			setLoading({ loading: false, text: "Loading..." })
		}).catch(() => {
			setLoading({ loading: false, text: "Loading..." })
		})
	}

	const createProject = () => {
		ls.removeStorage('project');
		handlerNewProject();
	}

	const deleteProject = async (id) => {
		await Service.Project.deleteProject(user.token, id).then((data) => {
			data.status === 'success' && fetchProjects();
		});
	}

	const editProject = async (id) => {
		const data = await Service.Project.getProjectDetail(id, user.token);
		if(data.status === 'success') {
			ls.addStorage('project', data.data);
			handlerNewProject();
		}
	}
	const viewProject = async (id) => {
		setLoading({loading: true, text: "Loading..."});
		const structure = await Service.Structure.getStructure();
		setStructure(structure.data.pages);
		const data = await Service.Project.getProjectDetail(id, user.token);
		if(data.status === 'success') {
			setSelectedProject(data.data);
		}
		setLoading({loading: false, text: "Loading..."});
	}

	const generateReport = async (row) => {
		Swal.fire({
			text: 'Confirm to generate report for this project?',
			icon: 'success',
			iconHtml: '<div class="material_symbols">article</div>',
			showCancelButton: true,
			confirmButtonText: 'Confirm >',
			confirmButtonColor: '#0B8E54',
			cancelButtonText: '< Cancel',
			backdrop: '#0D333182',
			buttonsStyling: false,
			reverseButtons: true,
			customClass: {
				confirmButton: project_styles['confirm_swal_button'],
				cancelButton: project_styles['cancel_swal_button']
			}
		}).then(async (result) => {
			if (result.isConfirmed) {
				let res = await Service.Reports.generate(row._id);

				const key = 'create';
				if (res?.status === 'success') {
					{
						res.data.name = row.name;
						handlerNewReport(res, key, row._id);
					}
				} else {
					Swal.fire({
						title: '...opp',
						text: res?.response?.data?.error?.message ?? 'error',
						confirmButtonColor: '#0B8E54',
						confirmButtonText: 'Confirm >',
						buttonsStyling: false,
						backdrop: '#0D333182',
						customClass: {
							confirmButton: project_styles['confirm_swal_button']
						}
					});
				}
			}
		});
	}

	const declineProject = async (rejectMessage) => {
		setLoading({loading: true, text: "Declining..."});
		let res = await Service.Project.projectReject(selectedProject.metadata?._id, user.token, rejectMessage);
		setLoading({loading: false, text: "Declining..."});
		if (res?.status === 'success') {
			Swal.fire({
				title: '...oops',
				text: res?.message ?? 'rejected success',
				confirmButtonColor: '#0B8E54',
				confirmButtonText: 'Confirm >',
				buttonsStyling: false,
				backdrop: '#0D333182',
				customClass: {
					confirmButton: project_styles['confirm_swal_button']
				}
			}).then(() => {
				message.open({
					type: 'success',
					content: 'This is a prompt message for success, and it will disappear in 10 seconds',
					duration: 20
				});
				window.location.pathname = '/dashboard';
				setSelectedProject({});
			});
		} else {
			Swal.fire({
				title: '...oops',
				text: res?.message ?? 'error',
				confirmButtonColor: '#0B8E54',
				confirmButtonText: 'Confirm >',
				buttonsStyling: false,
				backdrop: '#0D333182',
				customClass: {
					confirmButton: project_styles['confirm_swal_button']
				}
			});
		}
	}

	const validateProject = async ()=> {
		setLoading({loading: true, text: "Validating..."});
		let project = await Service.Project.projectVerify(selectedProject.metadata?._id, user.token);
		setLoading({loading: false, text: "Validating..."});
		if (project?.status === 'success') {
			Swal.fire({
				title: '...oops',
				text: project?.message ?? 'verified success',
				confirmButtonColor: '#0B8E54',
				confirmButtonText: 'Confirm >',
				buttonsStyling: false,
				backdrop: '#0D333182',
				customClass: {
					confirmButton: project_styles['confirm_swal_button']
				}
			}).then(() => {
				message.open({
					type: 'success',
					content: 'This is a prompt message for success, and it will disappear in 10 seconds',
					duration: 20
				});
				setSelectedProject({});
				window.location.pathname = '/dashboard';
			});
		} else {
			Swal.fire({
				title: '...oops',
				text: project?.message ?? 'error',
				confirmButtonColor: '#0B8E54',
				confirmButtonText: 'Confirm >',
				buttonsStyling: false,
				backdrop: '#0D333182',
				customClass: {
					confirmButton: project_styles['confirm_swal_button']
				}
			});
		}
	}

	return (
		<div className='bg-white h-100 p-5 position-relative'>
			<div className={`d-flex flex-row justify-content-between align-items-center ${project_styles["title-container"]}`}>
				<h2>Projects</h2>
				{user.role === "pp" && <button className={project_styles['title-container__add-project-btn']} onClick={createProject}>
					+ Create New Project
				</button>}
			</div>
			<div className="divider"></div>
			<div className={`position-relative ${project_styles['project-table-container']}`}>
				{
					loading.loading && <Spinner text={loading.text} type={{marginTop: 60}}/>
				}
				{
					!selectedProject?( user.role === "pp" ?
						<PpProject projects={projects} deleteProject={ deleteProject }  editProject={ editProject } generateReport={generateReport}/>
					: user.role === "vvb" ?
						<VvbProjects projects={projects} viewProject={ viewProject } editProject={ editProject }/>
					: user.role === "admin" ?
						<AdminProjects projects={projects}  viewProject={ viewProject } editProject={ editProject }/>
					: <></>): <ReviewProject projectData={selectedProject} structure={structure} declineProject={declineProject} validateProject={validateProject} user={user}/>
				}
			</div>

		</div>
	);
};