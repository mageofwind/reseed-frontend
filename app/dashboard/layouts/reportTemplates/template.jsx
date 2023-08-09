import React, { useState, useEffect } from 'react';
import Service from '../../../../utils/api/services';
import reportTemplate_styles from './reportTemplate.module.scss';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Tabs, Alert } from 'antd';
import Image from 'next/image';
import ICONS from '@/assets/icons/icons';
import create_report_style from '../createReport/create_report.module.scss';
import Swal from 'sweetalert2';
import repo_style from '../reports/reports.module.scss';

export default function Template(props) {
	const [value, setValue] = useState('');
	const [tabActiveKey, setTabActiveKey] = useState('1');

	const onchange = (e, reportValue) => {
		setValue({ ...value, [`${reportValue}`]: e });
		console.log({...value, [`${reportValue}`]: e });
	};

	useEffect(() => {
		props.status === 0 && onCreateReportTemplate();
		console.log(props);
		setValue({
			LviReportIntroduction: props.templateData?.lviReport?.introduction??'',
			LviReportResult: props.templateData?.lviReport?.result??'',
			MonitoringReportProcessing: props.templateData?.monitoringReport?.processing??'',
			MonitoringReportResult: props.templateData?.monitoringReport?.result??''
		});
		console.log({
			LviReportIntroduction: props.templateData?.lviReport?.introduction??'',
			LviReportResult: props.templateData?.lviReport?.result??'',
			MonitoringReportProcessing: props.templateData?.monitoringReport?.processing??'',
			MonitoringReportResult: props.templateData?.monitoringReport?.result??''
		})

	}, [props.status])

	const templateEdit = (reportValue) => {
		console.log(reportValue);
		return (
			<>
				<Alert
					message={reportValue === 'LviReport' ? `${reportValue} Introduction` : `${reportValue} Methodology`}
					type="info"
					style={{ marginBottom: 15 }}
				/>
				<Editor
					apiKey="ln7avcehjl86xnufslph67w1ff22swh0y8e93tpgdlh4mk91"
					cloudChannel="5-dev"
					disabled={false}
					inline={false}
					style={{ marginTop: 10 }}
					onEditorChange={(e) => {
						reportValue === 'LviReport' ? onchange(e, `${reportValue}Introduction`) : onchange(e, `${reportValue}Processing`);
					}}
					value={value[(reportValue === 'LviReport' ? `${reportValue}Introduction` : `${reportValue}Processing`)]}
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
				<br />
				<Alert message={`${reportValue} Results`} type="info" style={{ marginBottom: 15 }} />
				<Editor
					apiKey="ln7avcehjl86xnufslph67w1ff22swh0y8e93tpgdlh4mk91"
					cloudChannel="5-dev"
					disabled={false}
					inline={false}
					onEditorChange={(e) => onchange(e, `${reportValue}Result`)}
					value={value[`${reportValue}Result`]}
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

	const array = ['LviReport', 'MonitoringReport'];
	const data = {
		lviIntroduction: value.LviReportIntroduction,
		lviResult: value.LviReportResult,
		monitoringProcessing: value.MonitoringReportProcessing,
		monitoringResult: value.MonitoringReportResult
	};

	const onCreateReportTemplate = () => {
		const fetchData = async () => {
			let res = await Service.ReportTemplate.createReportTemplateList(props.user.token, props.projectId, data);
			if (res?.status === 'success') {
				Swal.fire({
					title: 'Success',
					text: 'Report Template Saved',
					confirmButtonColor: '#0B8E54',
					confirmButtonText: 'OK',
					buttonsStyling: false,
					backdrop: '#0D333182',
					customClass: {
						confirmButton: repo_style['confirm_swal_button']
					}
				}).then(() => {
					window.location.pathname = '/dashboard'
				});
			} else {
				Swal.fire({
					title: '...oops',
					text: res?.message ?? 'error',
					confirmButtonColor: '#0B8E54',
					confirmButtonText: 'OK',
					buttonsStyling: false,
					backdrop: '#0D333182',
					customClass: {
						confirmButton: create_report_style['confirm_swal_button']
					}
				});
			}
		};
		fetchData()
	};
	const LviReport = (index) => (
		<a className={reportTemplate_styles['switch-report-type-btn'] + ' ' +  (tabActiveKey === "2" ? reportTemplate_styles['switch-report-type-btn__active']: '')} >
			<svg xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none" className={'me-1'}>
				<g>
					<path d="M0 5.50261V16.4979L9.5 22L19 16.4979V5.50261L9.5 0L0 5.50261ZM9.5 11.4967C9.40111 11.4967 9.30444 11.4676 9.22221 11.413C9.13999 11.3585 9.0759 11.2809 9.03806 11.1902C9.00022 11.0995 8.99031 10.9997 9.00961 10.9034C9.0289 10.8071 9.07652 10.7186 9.14645 10.6492C9.21637 10.5798 9.30546 10.5325 9.40245 10.5133C9.49944 10.4942 9.59998 10.504 9.69134 10.5416C9.7827 10.5792 9.86079 10.6428 9.91574 10.7244C9.97068 10.8061 10 10.9021 10 11.0002C10 11.1319 9.94732 11.2582 9.85355 11.3513C9.75979 11.4444 9.63261 11.4967 9.5 11.4967ZM9 9.60226C8.80746 9.66985 8.63086 9.77577 8.481 9.91353L7.394 9.26815L9 8.33582V9.60226ZM8.0205 10.7972C7.99316 10.9312 7.99316 11.0693 8.0205 11.2033L7 11.8114V10.1891L8.0205 10.7972ZM8.481 12.088C8.63095 12.2254 8.80755 12.3309 9 12.3982V13.6647L7.394 12.7343L8.481 12.088ZM10 12.3982C10.1925 12.3306 10.3691 12.2247 10.519 12.087L11.606 12.7323L10 13.6647V12.3982ZM10.9795 11.2033C11.0068 11.0693 11.0068 10.9312 10.9795 10.7972L12 10.1891V11.8114L10.9795 11.2033ZM10.519 9.91254C10.3691 9.77514 10.1925 9.66956 10 9.60226V8.33582L11.606 9.26616L10.519 9.91254ZM9 7.18655L6.416 8.68334L5.438 8.10051L9 6.03728V7.18655ZM6 9.59332V12.4072L5 13.0029V8.99759L6 9.59332ZM6.416 13.3167L9 14.8134V15.9627L5.438 13.9005L6.416 13.3167ZM10 14.8134L12.584 13.3172L13.562 13.9005L10 15.9632V14.8134ZM13 12.4072V9.59332L14 8.99759V13.0029L13 12.4072ZM12.584 8.68383L10 7.18655V6.03728L13.562 8.10051L12.584 8.68383ZM9 4.88751L4.4595 7.51867L3.481 6.93485L9 3.73824V4.88751ZM4 8.40185V13.5986L3 14.1944V7.80612L4 8.40185ZM4.4595 14.4828L9 17.113V18.2623L3.481 15.0656L4.4595 14.4828ZM10 17.113L14.5405 14.4818L15.519 15.0647L10 18.2623V17.113ZM15 13.5986V8.40185L16 7.80612V14.1944L15 13.5986ZM14.5405 7.51768L10 4.88751V3.73824L15.519 6.93485L14.5405 7.51768ZM9 2.58897L2.5025 6.35451L1.524 5.7692L9 1.43969V2.58897ZM2 7.21038V14.7901L1 15.3859V6.61465L2 7.21038ZM2.5025 15.65L9 19.411V20.5603L1.524 16.2313L2.5025 15.65ZM10 19.411L16.4975 15.6475L17.476 16.2303L10 20.5613V19.411ZM17 14.7891V7.21038L18 6.61465V15.3859L17 14.7891ZM16.4975 6.34954L10 2.58897V1.43969L17.476 5.76969L16.4975 6.34954Z" fill="#9E977F"/>
				</g>
			</svg>
			LVI Report
		</a>
	);
	const MonitoringReport = (index) => (
		<a className={reportTemplate_styles['switch-report-type-btn'] + ' ' + (tabActiveKey === "1" ? reportTemplate_styles['switch-report-type-btn__active']: '')}>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" viewBox="0 0 14 20" className={'me-1'}>
				<g>
					<path d="M14 6.96945C14.0008 5.64526 13.6226 4.34825 12.9099 3.23028C12.1972 2.1123 11.1793 1.21962 9.97551 0.656741C8.77169 0.0938654 7.43174 -0.115911 6.11253 0.051973C4.79331 0.219857 3.54943 0.758452 2.5265 1.6047C1.50358 2.45095 0.743943 3.56984 0.336534 4.83037C-0.0708755 6.0909 -0.109199 7.4409 0.226049 8.72233C0.561297 10.0038 1.25624 11.1636 2.22953 12.066C3.20281 12.9684 4.41415 13.5761 5.72174 13.8179V15.6058H4.86956C4.84926 15.6046 4.82892 15.6076 4.80989 15.6148C4.79086 15.622 4.77358 15.6331 4.7592 15.6474C4.74481 15.6618 4.73364 15.679 4.72644 15.6979C4.71923 15.7169 4.71615 15.7371 4.71739 15.7573V19.8482C4.71615 19.8685 4.71923 19.8887 4.72644 19.9077C4.73364 19.9266 4.74481 19.9438 4.7592 19.9581C4.77358 19.9725 4.79086 19.9836 4.80989 19.9907C4.82892 19.9979 4.84926 20.001 4.86956 19.9998H9.13043C9.15074 20.001 9.17108 19.9979 9.19011 19.9907C9.20914 19.9836 9.22642 19.9725 9.2408 19.9581C9.25519 19.9438 9.26636 19.9266 9.27356 19.9077C9.28077 19.8887 9.28385 19.8685 9.28261 19.8482V15.7573C9.28385 15.7371 9.28077 15.7169 9.27356 15.6979C9.26636 15.679 9.25519 15.6618 9.2408 15.6474C9.22642 15.6331 9.20914 15.622 9.19011 15.6148C9.17108 15.6076 9.15074 15.6046 9.13043 15.6058H8.27826V13.8179C9.88618 13.5236 11.3395 12.677 12.385 11.4256C13.4305 10.1742 14.002 8.59724 14 6.96945ZM2.58696 6.96945C2.58696 6.10041 2.84578 5.25089 3.33069 4.52831C3.8156 3.80573 4.50482 3.24255 5.3112 2.90998C6.11758 2.57741 7.00489 2.4904 7.86094 2.65994C8.71699 2.82948 9.50332 3.24796 10.1205 3.86247C10.7377 4.47697 11.158 5.25989 11.3282 6.11223C11.4985 6.96458 11.4111 7.84805 11.0771 8.65094C10.7431 9.45382 10.1775 10.1401 9.45176 10.6229C8.72603 11.1057 7.87282 11.3634 7 11.3634C5.82983 11.3626 4.70783 10.8994 3.8804 10.0755C3.05297 9.2517 2.58776 8.13455 2.58696 6.96945Z" fill="#005431"/>
					<path d="M9.43482 5.75755C9.38222 5.75283 9.32937 5.76336 9.28264 5.78785C9.19298 5.87077 9.08752 5.93494 8.97252 5.97658C8.85751 6.01822 8.73529 6.03648 8.61308 6.03028C8.33162 6.0269 8.06265 5.91407 7.86361 5.71589C7.66458 5.51772 7.55126 5.24991 7.54786 4.96967C7.55154 4.78751 7.60408 4.60965 7.70003 4.45452C7.71524 4.43216 7.72337 4.40577 7.72337 4.37876C7.72337 4.35176 7.71524 4.32537 7.70003 4.303C7.6696 4.2424 7.63917 4.2121 7.5783 4.2121C7.38742 4.17694 7.19408 4.15667 7.00004 4.15149C6.45227 4.15149 5.9168 4.31322 5.46135 4.61622C5.00589 4.91923 4.65091 5.34991 4.44129 5.85379C4.23167 6.35767 4.17682 6.91212 4.28369 7.44704C4.39055 7.98196 4.65433 8.47331 5.04166 8.85897C5.42899 9.24462 5.92248 9.50725 6.45972 9.61366C6.99696 9.72006 7.55383 9.66545 8.0599 9.45673C8.56597 9.24802 8.99852 8.89457 9.30284 8.44109C9.60717 7.98761 9.7696 7.45446 9.7696 6.90907C9.76836 6.53221 9.68531 6.16007 9.52612 5.81816C9.49882 5.79363 9.46806 5.77321 9.43482 5.75755Z" fill="#005431"/>
				</g>
			</svg>
			{/*<Image src={ICONS.monitoring} width={22} height={50} alt="home" />*/}
			Monitoring Report
		</a>

		// <a className={reportTemplate_styles['lviBtn']}  style={{ textDecoration: 'underline' }}>
		// 	<Image className={reportTemplate_styles['lviBtn']} src={ICONS.lvi} width={22} height={50} alt="home" />
		// 	LVI Report
		// </a>
	);

	const handleOnTabChanged = (activekey) => {
		console.log(typeof activekey);
		setTabActiveKey(activekey);
	}

	const report_array  = ['MonitoringReport', 'LviReport']
	return (
		<div>
			<Tabs
				onChange={handleOnTabChanged}
				style={{ height: '100%', width: '100%' }}
				defaultActiveKey="1"
				items={report_array.map((label, i) => {
					const id = String(i + 1);
					return {
						label: label === 'LviReport' ? LviReport() : MonitoringReport(),
						key: id,
						children: templateEdit(label)
					};
				})}
			/>
			
		</div>
	);
}
