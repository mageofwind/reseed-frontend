'use client';
import internal_pages from './layouts/exportFile';
import Sidebar from './components/sidebar';
import Userdiv from './components/user/user';
import { useEffect, useReducer, useState } from 'react';
import Service from '@/utils/api/services';
import Dashboard_style from './styles/dashboard.module.scss';
import './styles/globalTable.style.scss';
import ls from '@/utils/localStorage/ls';

export default function Dashboard() {
	const [catSelected, setCatSelected] = useState(1);
	const [reportList, setReportList] = useState('');
	const [createReport, setCreateReport] = useState(false);
	const [id, setId] = useState('');
	const [flag, setFlag] = useState('create');
	const DataReducer = (state, action) => {
		if (action?.type === 'addPP') return { ...state, pp: [...action.data] };
		if (action?.type === 'addVVB') return { ...state, vvb: [...action.data] };
		if (action?.type === 'addAll') return { ...state, all: [...action.data] };
	};
	const [data, disData] = useReducer(DataReducer, { pp: [], vvb: [], all: [] });
	const [countData, setCount] = useState({ pp: 0, vvb: 0, all: 0, approvedProject: 0, approvedReport: 0, role: '' });
	const [nedCreate, setCreate] = useState(false);
	const [existUser, setSecuredUser] = useState({});

	useEffect(() => {
		let user = ls.getStorage('user');
		setSecuredUser(user);

		//! Agregar comprobacion de status

		const fetchData = async () => {
			//* Recoleccion de datos de los Requests
			if (user.role === 'admin') {
				let AllPPs,
					AllVVbs,
					AllData = [],
					AllCount = 0;
				AllPPs = await Service.Requests.getAllPPs();
				AllVVbs = await Service.Requests.getAllVVBs();


				if (AllPPs !== undefined && AllPPs?.data && AllPPs.data?.list) {
					let count = 0;
					AllPPs.data.list.map((l) => {
						if (l.status === 'pending') count += 1;
					});
					setCount((prev) => ({ ...prev, pp: count }));
					AllCount += count;
					AllData.push(AllPPs.data.list);
					disData({ type: 'addPP', data: AllPPs.data.list });
				}

				if (AllVVbs !== undefined && AllVVbs?.data && AllVVbs.data?.list) {
					let count = 0;
					AllVVbs.data.list.map((l) => {
						if (l.status === 'pending') count += 1;
					});
					setCount((prev) => ({ ...prev, vvb: count }));
					AllCount += count;
					AllData.push(AllVVbs.data.list);
					disData({ type: 'addVVB', data: AllVVbs.data.list });
				}

				setCount((prev) => ({ ...prev, all: AllCount, role: user.role }));
				disData({ type: 'addAll', data: AllData.flat() });
            }
			else if (user.role === 'vvb') {
				let approvedReport = await Service.Reports.getReportSubmittedList();
				let approvedProject = await Service.Project.getProjectSubmittedList(user.token);

                let countProject = 0;
                let countReport = 0;

                approvedReport?.data?.data?.map(report =>{
                    if(report.status == 'submitted') {
                        countReport = countReport + 1;
                    }
                })

				countProject = approvedProject?.data?.length;

				setCount((prev) => ({ ...prev, "approvedReport": countReport, approvedProject: countProject, role: user.role }));
			}
		};
		ls.removeStorage('project');
		fetchData();
	}, []);

	const handlerNewProject = () => {
		setCreate(true);
		setCatSelected(0);
	};

	const handlerNewReport = (res, flag, id) => {
		console.log(res);
		setReportList(res);
		setId(id);
		setFlag(flag ?? 'create');
		// setCreateReport(true);
		setCatSelected(13)
	};

	const renderCatSwitch = () => {
		if (nedCreate || catSelected === 0) {
			return <internal_pages.CreateProjects user={existUser} />;
		}
		if (catSelected === 13) {
			return <internal_pages.CreateReport reportList={reportList} user={existUser} id={id} flag={flag} />;
		}
		if (catSelected === 1) {
			return <internal_pages.Home user={existUser} handlerNewProject={handlerNewProject} />;
		}
		if ([2, 2.1, 2.2].includes(catSelected)) {
			return <internal_pages.Requests user={existUser} catSelected={catSelected} data={data} countData={countData} />;
		}
		if (catSelected === 3) {
			return <internal_pages.Projects user={existUser} handlerNewProject={handlerNewProject} handlerNewReport={handlerNewReport} />;
		}
		if (catSelected === 3.1) {
			return <internal_pages.getSubmittedProject user={existUser} />;
		}
		if (catSelected === 5) {
			return <internal_pages.Reports user={existUser} handlerNewReport={handlerNewReport} />;
		}
        if (catSelected === 5.1) {
			return <internal_pages.PendingReports user={existUser}/>;
		}
		if (catSelected === 6) {
			return <internal_pages.reportTemplate user={existUser}/>;
		}
		if (catSelected === 10) {
			return <internal_pages.PersonalInfo user={existUser} />;
		}
		if (catSelected === 11) {
			return <internal_pages.EmailSettings />;
		}
		if (catSelected === 12) {
			return <internal_pages.DataPrivacy />;
		}
	};

	return (
		<div id={Dashboard_style['container']}>
			<Sidebar
				data={catSelected}
				controler={setCatSelected}
				countData={countData}
				nedCreate={nedCreate}
				handlerNewProject={handlerNewProject}
				setCreate={setCreate}
				user={existUser}
			/>
			<div id={Dashboard_style['body']}>
				<Userdiv data={catSelected} controler={setCatSelected} user={existUser} />
				{renderCatSwitch()}
			</div>
		</div>
	);
}
