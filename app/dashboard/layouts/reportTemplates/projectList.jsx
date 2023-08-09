import { useEffect, useState } from 'react';
import reportTemplate_styles from './reportTemplate.module.scss';
import DataGrid from 'react-data-grid';
import Service from '../../../../utils/api/services';
import Template from './template';
import TemplateByProjectId from './templateByProjectId';
import { Editor } from '@tinymce/tinymce-react';

export default function ProjectList(props) {
	const [state, setState] = useState(0);
	const [projectId, setProjectId] = useState('');
	const [label, setLabel] = useState('Report Templates');
	const [template, setTemplate] = useState('');
	const [status, setStatus] = useState('');
	const [overview, setOverview] = useState('');
	const [selectedTemplate, setSelectedTemplate] = useState({});

	const columns = [
		{
			key: 'name',
			name: 'Project Name'
			// renderCell: (row) => {
			// 	return <a style={{ color: '#0D3331', textDecoration: 'underline', cursor: 'pointer' }}>{row.row.name}</a>;
			// }
		},
		{ key: '_id', name: 'Register ID' },
		{ key: 'country', name: 'Country' },
		{ key: 'region', name: 'Region' },
		{
			key: 'status',
			name: 'Status',
			renderCell: (row) => {
				return (
					<>
						{row.row.status === 'pending' ? (
							<p style={{ color: '#EE8700' }}>{row.row.status}</p>
						) : row.row.status === 'approved' ? (
							<p style={{ color: '#0B8E54' }}>{row.row.status}</p>
						) : (
							<p style={{ color: '#D10000' }}>{row.row.status}</p>
						)}
					</>
				);
			}
		},
		{
			key: 'action',
			name: 'Action',
		}
	];
	const rows = () => {
		let table = [];
		if (props?.projects?.projectList) {
			table = props?.projects?.projectList.map((p) => {
				return {
					name: p.metadata?.project_information?.project_name,
					_id: p._id ?? '',
					country: props?.projects?.userMeta?.metadata?.corporate_information.country ?? '',
					region: props?.projects?.userMeta?.metadata?.corporate_information.region ?? '',
					status: p.status ?? '',
					action: template[p._id],
				};
			});
		}
		return table;
	};

	const addTemplate = (key) => {
		setLabel(key.name);
		setState(1);
		setProjectId(key._id);
	};

	const visibleTemplate = async (key) => {
		let res = await Service.ReportTemplate.getReportTemplateListById(props.user.token, key._id);
		if (res?.status === 'success') {
			setSelectedTemplate(res.data);
		}
		setProjectId(key._id);
		setLabel(key.name);
		setState(1);
	};
	const templateByProjectId = () => {
		return <TemplateByProjectId projectId={projectId} user={props.user} />;
	};

	const fetchReportTemplates = () => {
		Service.ReportTemplate.getReportTemplateList(props.user.token).then((data) => {
			setOverview(data.data.reportTemplate.generic_monitoring_report_overview);
			setTemplate(data?.data?.reportTemplate);
		});
	};

	useEffect(() => {
		fetchReportTemplates();
	}, []);


	const actions = (key) => {
		key.action = (
			<div className={reportTemplate_styles['action_div']} key={key._id}>
				{template[key._id] ? (
					<>
						<p className={reportTemplate_styles['eye']} onClick={() => visibleTemplate(key)}>
							visibility
						</p>
					</>
				) : (
					<>
						<p className={reportTemplate_styles['eye']} onClick={() => addTemplate(key)}>
							lab_profile
						</p>
					</>
				)}
			</div>
		);
	};



	const projectPage = () => {
		return <DataGrid columns={columns} rows={rows()} headerRowHeight={60} rowHeight={50} rowKeyGetter={actions} />;
	};

	const templatePage = () => {
		return <Template projectId={projectId} user={props.user} status={status} templateData={selectedTemplate}/>;
	};

	const onChangeStatus = () => {
		setStatus(0);
	};

	const onCreate = () => {
		setState(3);
	};

	const onChangeOverview = (e) =>{
		setOverview(e)
	}

	const generateOverview = () => {
		return (
			<>
				<Editor
					apiKey="ln7avcehjl86xnufslph67w1ff22swh0y8e93tpgdlh4mk91"
					cloudChannel="5-dev"
					disabled={false}
					inline={false}
					onEditorChange={(e) => onChangeOverview(e)}
					value={overview}
					outputFormat="html"
					init={{
						height: 600,
						width: '100%',
						language: 'en',
						plugins: [
							'advlist autolink lists link image charmap print preview anchor',
							'searchreplace visualblocks code fullscreen',
							'insertdatetime media table paste code help wordcount export'
						],
						toolbar:
							'undo redo | formatselect | bold italic backcolor |' +
							'alignleft aligncenter alignright alignjustify |' +
							'bullist numlist outdent indent | removeformat | help export'
					}}
				/>
			</>
		);
	};

	const createGenerate = () => {
		const fetchData = async () => {
			let res = await Service.ReportTemplate.generateReportOverview(props.user.token, overview);
			if (res?.status === 'success') {
				window.location.pathname = '/dashboard';
			}
		};
		fetchData();
	};

	return (
		<div className='bg-white h-100 p-5 position-relative'>

			<div className={reportTemplate_styles['title_container']}>
				<h1>{label}</h1>
				{state === 1 ? (
					<button className={reportTemplate_styles['plusBtn']} onClick={onChangeStatus}>
						Save Report Template
					</button>
				) : state === 0 ? (
					<button className={reportTemplate_styles['plusBtn']} onClick={() => onCreate()}>
						Update Generic Monitoring Overview
					</button>
				) : (
					state === 3 ? (
						<button className={reportTemplate_styles['plusBtn']} onClick={createGenerate}>
							Save
						</button>
					) : ''
				)}
			</div>
			<hr />
			{/* eslint-disable-next-line */}
			{state === 0 ? projectPage() : state === 1 ? templatePage() : state === 2 ? templateByProjectId() : generateOverview()}
		</div>
	);
}
