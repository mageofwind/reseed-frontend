import DataGrid from 'react-data-grid';

import 'react-data-grid/lib/styles.css';
import project_styles from '@/app/dashboard/layouts/projects/projects.module.scss';
import { Popconfirm } from 'antd';
export default ({ projects, deleteProject, editProject, generateReport }) => {
	const columns = [
		{
			key: 'name',
			name: 'Project Name',
			renderCell: (row) => {
				return <a style={{ color: '#0D3331', textDecoration: 'underline', cursor: 'pointer' }}>{row.row.name}</a>;
			}
		},
		{ key: '_id', name: 'Register ID' },
		{ key: 'country', name: 'Country' },
		{ key: 'region', name: 'Region' },
		{
			key: 'status',
			name: 'Status',
			renderCell: ({ row }) => {
				return (
					<p style={{ color: row.status === 'pending'?'#EE8700': row.status==='approved' ? '#0B8E54' : '#D10000' }}>{row.status}</p>
				);
			}
		},
		{
			key: 'action',
			name: 'Action',
			renderCell: ({ row }) => {
				return (
					<div className={project_styles['action_div']}>
						{
							row.status === 'approved'&& <div className={`d-flex justify-content-center align-items-center ${project_styles['action-icon-button']}`}  onClick={() => generateReport(row)}>lab_profile</div>
						}
						{
							(row.status === 'rejected' || row.status === "pending") && <div className={`d-flex justify-content-center align-items-center ${project_styles['action-icon-button']}`} onClick={() => editProject(row._id)}>edit</div>
						}
						{
							row.status !== 'approved' && (
								<Popconfirm
									title="Delete the project"
									description="Are you sure to delete this project?"
									onConfirm={() => deleteProject(row._id)}
									okText="Yes"
									cancelText="No"
								>
									<div className={`d-flex justify-content-center align-items-center ${project_styles['action-icon-button']}`} >delete</div>
								</Popconfirm>
							)
						}
					</div>
				);
			}
		}
	];
	const rows = projects?.data?.projectList.map((p) => {
		const item = {
			name: p.metadata?.project_information?.project_name ?? '',
			_id: p._id ?? '',
			country: projects.data?.userMeta?.metadata?.corporate_information.country ?? '',
			region: projects.data?.userMeta?.metadata?.corporate_information.region ?? '',
			status: p.status ?? '',
			action: '' ?? ''
		};
		return item;
	}) || [];
	return <DataGrid columns={columns} rows={rows} headerRowHeight={60} rowHeight={50}></DataGrid>;
}
