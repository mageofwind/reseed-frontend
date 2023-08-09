import DataGrid from 'react-data-grid';
import React, { useEffect, useState } from 'react';
import Service from '@/utils/api/services';
import repo_style from '../reports/reports.module.scss';
import Spinner from '../../components/spinner/spinner';

export default function PendingReports({ user }) {
	const [project, setProject] = useState([]);
	const [loading, setLoading] = useState({loading: false, text: "Loading..."});

	useEffect(() => {

		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading({loading: true, text: "Loading..."});
		let res = await Service.Project.getProjectSubmittedList(user.token);
		if (res?.status === 'success') {
			setProject(res.data ?? []);
		}
		setLoading({loading: false, text: "Loading..."});
	};

	const column = [
		{
            key: 'name',
            name: 'Project Name',
        },
        { key: '_id', name: 'Register ID' },
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
                    name: p.metadata?.project_information?.project_name ?? '',
                    _id: p._id ?? '',
                    status: p.status ?? '',
                    action: '' ?? ''
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
