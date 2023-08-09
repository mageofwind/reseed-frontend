import repo_style from './reports.module.scss';
import DataGrid from 'react-data-grid';
import React, { useEffect, useState } from 'react';
import Service from '@/utils/api/services';
import Spinner from '../../components/spinner/spinner';


export default function PendingReports({ user }) {
	const [project, setProject] = useState([]);
	const [loading, setLoading] = useState({loading: false, text: "Loading..."});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading({loading: true, text: "Loading..."});
		let res = await Service.Reports.getReportSubmittedList();
		console.log(res)
		if (res?.data?.status === 'success') {
			setProject(res.data?.data ?? []);
		}
		setLoading({loading: false, text: "Loading..."});
	};

	const column = [
		{ key: 'id', name: 'Register Id' },
		{ key: 'year', name: 'Year' },
		{ key: 'monitoringReport', name: 'Monitoring Report' },
		{ key: 'lviReport', name: 'LVI' },
		{
			key: 'status',
			name: 'Status',
			renderCell: (row) => {
				return (
					<>
						{row.row.status == 'pending' ? (
							<p style={{ color: '#EE8700' }}>{row.row.status}</p>
						) : row.row.status == 'approved' ? (
							<p style={{ color: '#0B8E54' }}>{row.row.status}</p>
						) : (
							<p style={{ color: '#D10000' }}>{row.row.status}</p>
						)}
					</>
				);
			}
		},
	];

	const row = () => {
		let table = [];
		if (project) {
			table = project.map((p) => {
				const item = {
					id: p._id,
					year: p.vintage ?? new Date().getFullYear(),
					monitoringReport: p.monitoringReport?.html ?? '',
					lviReport: p.lviReport.html ?? '',
					status: p.status ?? '',
				};
				return item;
			});
			return table;
		}
	};

	return (
		<div className='bg-white h-100 p-5 position-relative'>
			<div>
				<h1>Welcome to ReSeed!</h1>
			</div>
			<hr />
			<div className={`position-relative ${repo_style['divgrid']}`}>
				{
					loading.loading && <Spinner text={loading.text} type={{marginTop: 60}}/>
				}
				<DataGrid columns={column} rows={row()} headerRowHeight={60} rowHeight={50} />
			</div>
		</div>
	);
}
