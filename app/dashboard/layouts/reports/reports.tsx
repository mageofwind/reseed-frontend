'use client';
import DataGrid from 'react-data-grid';
import React, { useEffect, useRef, useState } from 'react';
import repo_style from './reports.module.scss';
import Service from '@/utils/api/services';
import Swal from 'sweetalert2';
import Spinner from '@/app/dashboard/components/spinner/spinner';

interface user {
	email: string;
	email_verified: boolean;
	name: string;
	nickname: string;
	picture: string;
	role: string;
	statusMeta: string;
	sub: string;
	token: string;
	updated_at: string;
	_id: string;
}

export default function Reports({ user, handlerNewReport }: { user: user; handlerNewReport: Function }) {
	const [reportsList, setReportsList] = useState([]);
	const [reportList, setReportList] = useState([]);
	const [reportName, setReportName] = useState('');
	const [state, setState] = useState(true);
	const [status, setStatus] = useState('');
	const [projectId, setProjectId] = useState('');
	const [loading, setLoading] = useState({loading: false, text: "Loading..."});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading({loading: true, text: "Loading..."});
		let res = await Service.Reports.getProjectListHavingReport(user.token);
		if (res?.status === 'success') {
			setReportsList(res.data ?? []);
		}
		setLoading({loading: false, text: "Loading..."});
	};

	let report_title = '';
	if (user.role == 'pp') {
		report_title = 'Report Created by Project';
	} else {
		report_title = 'Report Created';
	}

	const getReportListByProjectId = (id: any) => {
		const fetchData = async () => {
			let res = await Service.Reports.getReportListByProjectId(id);
			setReportList(res?.data ?? []);
		};
		fetchData();
	};

	const handleClickReport = (row: any) => {
		setProjectId(row.row.registerId);
		setState(false);
		setStatus(row.row.status);
		setReportName(row.row.name);
		getReportListByProjectId(row.row.registerId);
	};

	const handleVisible = (key: any) => {
		const flag = 'visible';
		const data = {
			data: {
				id: key.id,
				dataCreated: key.dataCreated,
				dataSubmitted: key.dataSubmitted,
				dataVerified: key.dataVerified,
				lvi: key.lviReport,
				monitoring: key.monitoringReport,
				status: key.status,
				year: key.year,
				name: reportName
			}
		};
		handlerNewReport(data, flag);
	};

	const handleUpdate = (key: any) => {
		const flag = 'update';
		const data = {
			data: {
				id: key.id,
				dataCreated: key.dataCreated,
				dataSubmitted: key.dataSubmitted,
				dataVerified: key.dataVerified,
				lvi: key.lviReport,
				monitoring: key.monitoringReport,
				status: key.status,
				year: key.year,
				name: reportName
			}
		};
		handlerNewReport(data, flag);
	};

	let res = [];
	const generateReport = () => {
		Swal.fire({
			text: 'Confirm to generate report for this project?',
			showCancelButton: true,
			confirmButtonText: 'Confirm >',
			confirmButtonColor: '#0B8E54',
			cancelButtonText: '< Cancel',
			backdrop: '#0D333182',
			buttonsStyling: false,
			reverseButtons: true,
			customClass: {
				confirmButton: repo_style['confirm_swal_button'],
				cancelButton: repo_style['cancel_swal_button']
			}
		}).then(async (result) => {
			if (result.isConfirmed) {
				res = await Service.Reports.generate(projectId);
				if (res?.status === 'success') {
					{
						const flag = 'create';
						handlerNewReport(res, flag, projectId);
					}
				} else {
					Swal.fire({
						title: res.error.message,
						text: res?.message ?? 'error',
						confirmButtonColor: '#0B8E54',
						confirmButtonText: 'Confirm >',
						buttonsStyling: false,
						backdrop: '#0D333182',
						customClass: {
							confirmButton: repo_style['confirm_swal_button']
						}
					});
				}
			}
		});
	};

	let column: any = '';
	if (user.role == 'admin') {
		column = [
			{
				key: 'name',
				name: 'Project Proponent Name',
				renderCell: (row: any) => {
					return (
						<a style={{ color: '#0D3331', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleClickReport(row)}>
							{row.row.name}
						</a>
					);
				}
			},
			{ key: 'registerId', name: 'RegisterId' },
			{ key: 'verifier', name: 'VVB' },
			{
				key: 'status',
				name: 'Status',
				renderCell: (row: any) => {
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
			}
		];
	} else {
		column = [
			{
				key: 'name',
				name: 'Project Proponent Name',
				renderCell: (row: any) => {
					return (
						<a style={{ color: '#0D3331', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleClickReport(row)}>
							{row.row.name}
						</a>
					);
				}
			},
			{ key: 'registerId', name: 'RegisterId' },
			{ key: 'verifier', name: 'VVB' },
			{
				key: 'status',
				name: 'Status',
				renderCell: (row: any) => {
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
			}
			// { key: 'actions', name: 'Actions' }
		];
	}

	const columns = [
		{ key: 'year', name: 'Year' },
		{ key: 'monitoringReport', name: 'Monitoring Report' },
		{ key: 'lviReport', name: 'LVI' },
		{
			key: 'status',
			name: 'Status',
			renderCell: (row: any) => {
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
		{ key: 'dateCreated', name: 'DateCreated' },
		{ key: 'dateSubmitted', name: 'Date Submitted' },
		{ key: 'dateVerified', name: 'Date Verified On' },
		{ key: 'action', name: 'Action' }
	];

	let row: any = [];
	row = () => {
		let table = [];
		if (reportsList) {
			table = reportsList.map((p: any) => {
				const item = {
					name: p.metadata?.project_information?.project_name ?? '',
					registerId: p._id,
					verifier: p.metadata?.project_information?.verifier ?? '',
					status: p.status ?? '',
					action: '' ?? ''
				};
				return item;
			});
			return table;
		}
	};

	const rows: any = () => {
		let table = [];
		if (reportList) {
			table = reportList.map((p: any) => {
				const item = {
					id: p._id,
					year: p.vintage ?? new Date().getFullYear(),
					monitoringReport: p.monitoringReport?.html ?? '',
					lviReport: p.lviReport?.html ?? '',
					status: p.status ?? '',
					dateCreated: p.createdAt ?? '',
					dateSubmitted: p.submitDate ?? '',
					dateVerified: p.verifyDate ?? '',
					action: '' ?? ''
				};
				return item;
			});
			return table;
		}
	};

	const actions: any = (key: any) => {
		if (user.role == 'vvb') {
			if (key.status === 'submitted') {
				key.action = (
					<div className={repo_style['action_div']}>
						<p className={repo_style['eye']} onClick={() => handleVisible(key)}>
							edit
						</p>
					</div>
				);
			} else {
				key.action = (
					<div className={repo_style['action_div']}>
						<p className={repo_style['eye']} onClick={() => handleVisible(key)}>
							visibility
						</p>
					</div>
				);
			}
		} else if (user.role == 'pp') {
			if (key.status === 'pending') {
				key.action = (
					<div className={repo_style['action_div']}>
						<p className={repo_style['eye']} onClick={() => handleUpdate(key)}>
							edit
						</p>
					</div>
				);
			} else {
				key.action = (
					<div className={repo_style['action_div']}>
						<p className={repo_style['eye']} onClick={() => handleVisible(key)}>
							visibility
						</p>
					</div>
				);
			}
		} else {
			key.action = (
				<div className={repo_style['action_div']}>
					<p className={repo_style['eye']} onClick={() => handleVisible(key)}>
						visibility
					</p>
				</div>
			);
		}
	};

	let visible = 'false';
	let reject_status = 'false';
	let disable_status = 'false';
	reportList?.map((report: any) => {
		const current_year = new Date().getFullYear();
		if (report.vintage == current_year) {
			visible = 'true';
		}

		if (report.status == 'rejected') {
			reject_status = 'true';
		}

		if (report.status == 'pending' || report.status == 'approved' || report.status == 'submitted') {
			disable_status = 'true';
		}
	});

	const getRender = () => {
		return (
			<>
				<div>
					{state ? (
						<h1>{report_title}</h1>
					) : (
						<div className={repo_style['title_container']}>
							<h1>{report_title}</h1>
							{user.role == 'pp' ? (
								<>
									{status == 'approved' ? (
										<>
											{visible != 'true' ? (
												<>
													{disable_status == 'true' && reject_status == 'true' ? (
														<button
															disabled
															style={{ backgroundColor: '#cccccc' }}
															className={repo_style['plusBtn']}
															onClick={generateReport}
														>
															+ Create New Report
														</button>
													) : (
														<button className={repo_style['plusBtn']} onClick={generateReport}>
															+ Create New Report
														</button>
													)}
												</>
											) : (
												<button disabled className={repo_style['plusBtn']} style={{ backgroundColor: '#cccccc' }} onClick={generateReport}>
													+ Create New Report
												</button>
											)}
										</>
									) : (
										<button disabled className={repo_style['plusBtn']} style={{ backgroundColor: '#cccccc' }} onClick={generateReport}>
											+ Create New Report	
										</button>
									)}
								</>
							) : (
								''
							)}
						</div>
					)}
				</div>
				<hr />
				<div className={'position-relative'}>
					{
						loading.loading && <Spinner text={loading.text}  type={{marginTop: 60}}/>
					}
					{state ? (
						<div className={repo_style['divgrid']}>
							<DataGrid columns={column} rows={row()} headerRowHeight={60} rowHeight={50} rowKeyGetter={actions} />
						</div>
					) : (
						<div className={repo_style['divgrid']}>
							<DataGrid columns={columns} rows={rows()} headerRowHeight={60} rowHeight={50} rowKeyGetter={actions} />
						</div>
					)}
				</div>

			</>
		);
	};

	return <div className='bg-white h-100 p-5 position-relative'>
		{getRender()}
	</div>;
}
