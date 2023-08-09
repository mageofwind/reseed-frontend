import { useState, useEffect } from 'react';
import reportTemplate_styles from './reportTemplate.module.scss';
// import ProjectList from './projectList';
import { Editor } from '@tinymce/tinymce-react';
import DataGrid from 'react-data-grid';
import Service from '../../../../utils/api/services';
import ProjectList from './projectList';

export default function reportTemplate({ user }) {
	const [Projects, setProjects] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			let res = await Service.Project.fetchProjects(user.token);
			if (res?.status === 'success') {
				setProjects(res.data.data ?? []);
			}
		};
		fetchData();
	}, []);

	return <div>{<ProjectList projects = {Projects} user = {user}/>}</div>;
}
