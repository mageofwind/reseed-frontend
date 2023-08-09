'use client'


import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import project_styles from '@/app/dashboard/layouts/projects/projects.module.scss';
export default ({ projects, viewProject, editProject }) => {
	const columns = [
		{
			key: 'verifier',
			name: 'From',
			renderCell: (row) => {
				return <a style={{ color: '#0D3331', textDecoration: 'underline', cursor: 'pointer' }}>{row.row.verifier}</a>;
			}
		},
		{ key: 'company', name: 'Company' },
		{ key: 'country', name: 'Country' },
		{ key: 'date', name: 'Date' },
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
						<div className={`d-flex justify-content-center align-items-center ${project_styles['action-icon-button']}`} onClick={() => viewProject(row._id)}>visibility</div>
					</div>
				);
			}
		}
	];
	const rows = projects?.data?.projectList.map((p) => {
		const item = {
			_id: p._id ?? '',
			verifier: p.metadata?.project_information?.project_name ?? '',
			company: projects.data?.userMeta?.metadata?.corporate_information?.company_legal_name ?? '',
			country: projects.data?.userMeta?.metadata?.corporate_information?.country ?? '',
			date: p.createdAt ?? '',
			status: p.status ?? '',
			action: '' ?? ''
		};
		return item;
	}) || [];
	return <DataGrid columns={columns} rows={rows} headerRowHeight={60} rowHeight={50}></DataGrid>;
}
