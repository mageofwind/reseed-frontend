import { useState, useEffect } from 'react';
import Service from '../../../../utils/api/services';
import reportTemplate_styles from './reportTemplate.module.scss';
import Image from 'next/image';
import ICONS from '@/assets/icons/icons';

export default function TemplateByProjectId(props) {
	const [value, setValue] = useState('');
	const [state, setState] = useState(0);

	// const onchange = (e, reportValue) => {
	// 	setValue({ ...value, [`${reportValue}`]: e });
	// };

	useEffect(() => {
		const fetchData = async () => {
			let res = await Service.ReportTemplate.getReportTemplateListById(props.user.token, props.projectId);
			if (res?.status === 'success') {
				setValue(res.data);
			}
		};
		fetchData();
	}, []);

	const lviReport = value?.lviReport;
	const monitoringReport = value.monitoringReport;

	const clickLvi = () => {
		setState(0);
	};

	const clickMonitoring = () => {
		setState(1);
	};

	return (
		<div>
			<div style={{ backgroundColor: 'white', margin: '27px 154px 0px 145px' }}>
				<div style={{ padding: '64px 68px 0 58px' }}>
					<div style={{marginBottom: 20, justifyContent: 'end', display: 'flex'}}>
					<a
						className={reportTemplate_styles['monitoringBtn']}
						style={{ marginRight: 20, textDecoration: 'none', cursor: 'pointer' }}
						onClick={clickLvi}
					>
						<Image className={reportTemplate_styles['monitoringBtn']} src={ICONS.monitoring} width={22} height={50} alt="home" />
						Monitoring Report
					</a>
					<a
						className={reportTemplate_styles['lviBtn']}
						style={{ textDecoration: 'underline', cursor: 'pointer' }}
						onClick={clickMonitoring}
					>
						<Image className={reportTemplate_styles['lviBtn']} src={ICONS.lvi} width={22} height={50} alt="home" />
						LVI Report
					</a>
					</div>
					{state == 0 ? (
						<>
							<h1>Introduction</h1>
							<br />
							<div dangerouslySetInnerHTML={{ __html: lviReport?.result }}></div>
							<br />
							<h1>Result</h1>
							<br />
							<div dangerouslySetInnerHTML={{ __html: monitoringReport?.processing }}></div>
						</>
					) : (
						<>
							<h1>Processing</h1>
							<br />
							<div dangerouslySetInnerHTML={{ __html: monitoringReport?.processing }}></div>
							<br />
							<h1>Result</h1>
							<br />
							<div dangerouslySetInnerHTML={{ __html: monitoringReport?.result }}></div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
