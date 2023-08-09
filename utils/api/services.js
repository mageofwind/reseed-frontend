import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useRouter } from 'next/navigation';

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
const ESTRUCTUREPOINT = process.env.NEXT_PUBLIC_API_ESTRUCTURE;

const axiosInstance = axios.create();
// axiosInstance.defaults.maxRedirects = 0;
axiosInstance.defaults.withCredentials = true
axiosInstance.interceptors.response.use(
	response => {
		console.log(response.status)
		// window.location.reload();
		return Promise.resolve(response);
		// response;
	},
	error => {
		// console.log(error.response)
		if(error.response.data.redirect) {
			window.location.href = '/';
		}
		return Promise.reject(error);
	}
)


//*------------------------------------------------------------------------------
//TODO Servicios de Usuarios
const getUserWithToken = async (token) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/auth/getuserwithtoken`,
		headers: { Authorization: `Bearer ${token}` }
	};

	let AxiosResponse;
	await axiosInstance
		.request(options)
		.then((response) => {
			AxiosResponse = response.data;
		})
		.catch((err) => {
			AxiosResponse = err;
		});
	return AxiosResponse;
};
const getUserWithId = (id) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/auth/signup/page/${id}`
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const logOut = (id, token) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/auth/logout`,
		headers: { Authorization: `Bearer ${token}` }
	};
	axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => {
			Swal.fire({
				title: 'Error!',
				text: `${err}`,
				icon: 'error',
				confirmButtonText: 'I understand'
			});
		});
};

const approvedVVbs = async () => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/user/approvedVVbs`
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};
//*------------------------------------------------------------------------------

//*------------------------------------------------------------------------------
// PROJECTS Services
const fetchProjects = async (token) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/project`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};
const getProjectDetail = async (id, token) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/project/${id}`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const projectVerify = async (id, token) => {
	const options = {
		method: 'PATCH',
		url: `${ENDPOINT}${PREFIX}/project/${id}/verify`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const projectReject = async (id, token, rejectMessage) => {
	const options = {
		method: 'PATCH',
		url: `${ENDPOINT}${PREFIX}/project/${id}/reject`,
		headers: { Authorization: `Bearer ${token}` },
		data: { rejectMessage }
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const submitBasicInfo = async (obj, token) => {
	const options = {
		method: 'PUT',
		url: `${ENDPOINT}${PREFIX}/project/metadata`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		data: obj
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) =>
			Swal.fire({
				title: 'Error!',
				text: `${err.response.data}`,
				icon: 'error',
				confirmButtonText: 'I understand'
			})
		);
};
const confirmsubmit = async (id, token) => {
	const options = {
		method: 'patch',
		url: `${ENDPOINT}${PREFIX}/project/${id}/submit`,
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
	return axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};
const deleteProject = async (token, id) => {
	const options = {
		method: 'delete',
		url: `${ENDPOINT}${PREFIX}/project/${id}`,
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
	return axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};
const getProjectSubmittedList = async (token) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/project/getSubmittedProject`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

//TODO Servicios de Requests
const getAllPPs = () => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/user/allpps`
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const getAllVVBs = async () => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/user/allvvbs`
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const getDetails = (id) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/auth/signup/page/${id}`
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) =>
			Swal.fire({
				title: 'Log Out'
			})
		);
};

const Approved = (id, token) => {
	const options = {
		method: 'PATCH',
		url: `${ENDPOINT}${PREFIX}/auth/approve/${id}`,
		headers: { Authorization: `Bearer ${token}` }
	};
	axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => window.alert(err.response.data.error.message));
};
const Denied = (id, token, msg) => {
	const options = {
		method: 'PATCH',
		url: `${ENDPOINT}${PREFIX}/auth/decline/${id}`,
		headers: { Authorization: `Bearer ${token}` },
		data: {
			rejectMessage: msg
		}
	};
	axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => window.alert(err.response.data.error.message));
};
//*------------------------------------------------------------------------------

//*------------------------------------------------------------------------------
//TODO Servicios de Structure
const getStructure = () => {
	const options = {
		method: 'GET',
		url: `${ESTRUCTUREPOINT}/project/creation/pages`
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const getOrgType = () => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/organizationType`
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const getCountryList = () => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/country`
	};
	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const getDynamicList = (api) => {
	const url = new URL(api);
	const searchParams = new URLSearchParams(url.searchParams);

	let params = {};
	for (const [key, value] of searchParams.entries()) {
		params[key] = value;
	}

	const options = {
		method: 'GET',
		url: `${url.origin}${url.pathname}`,
		params: params
	};

	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
const onlyfordev = (id) => {
	const url = new URL(`https://reseed-metadata-service-development.up.railway.app/project/list?name=${id}`);
	const searchParams = new URLSearchParams(url.searchParams);

	let params = {};
	for (const [key, value] of searchParams.entries()) {
		params[key] = value;
	}

	const options = {
		method: 'GET',
		url: `${url.origin}${url.pathname}`,
		params: params
	};

	return axiosInstance
		.request(options)
		.then((response) => response.data)
		.catch((err) => err);
};
//*------------------------------------------------------------------------------

//*------------------------------------------------------------------------------
const getAllReportsList = async () => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/report/getAllReportList`
	};
	return await axiosInstance
		.request(options)
		.then((res) => res)
		.catch((err) => err);
};
const getReportSubmittedList = async () => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/report/getReportSubmittedList`
	};
	return await axiosInstance
		.request(options)
		.then((res) => res)
		.catch((err) => err);
};
const generate = async (id) => {
	const options = {
		method: 'POST',
		url: `${ENDPOINT}${PREFIX}/report/generateReport/${id}`
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const getProjectListHavingReport = async (token) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/report/getProjectListHavingReport`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const getReportListByProjectId = async (id) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/report/getReportListByProjectId/${id}`
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const updateReport = async (reportId, vintage, token, monitoring, lvi) => {
	console.log(vintage);
	const options = {
		method: 'post',
		url: `${ENDPOINT}${PREFIX}/report/update/${reportId}/${vintage}`,
		headers: { Authorization: `Bearer ${token}` },
		data: { monitoring, lvi }
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const submitReport = async (token, data) => {
	const options = {
		method: 'patch',
		url: `${ENDPOINT}${PREFIX}/report/${data.id}/submit`,
		headers: { Authorization: `Bearer ${token}` },
		data: data
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const getPendingReport = async (token) => {
	const options = {
		method: 'get',
		url: `${ENDPOINT}${PREFIX}/report/getReportPendingList`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const approveReport = async (id, token) => {
	const options = {
		method: 'patch',
		url: `${ENDPOINT}${PREFIX}/report/${id}/verify`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const rejectReport = async (id, token, data) => {
	const options = {
		method: 'patch',
		url: `${ENDPOINT}${PREFIX}/report/${id}/reject`,
		headers: { Authorization: `Bearer ${token}` },
		data: data
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

//*------------------------------------------------------------------------------

const getReportTemplateList = async (token) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/reportTemplate/getReportTemplateList`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const createReportTemplateList = async (token, projectId, data) => {
	const options = {
		method: 'POST',
		url: `${ENDPOINT}${PREFIX}/reportTemplate/createReportTemplate/${projectId}`,
		headers: { Authorization: `Bearer ${token}` },
		data: data
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const getReportTemplateListById = async (token, projectId) => {
	const options = {
		method: 'GET',
		url: `${ENDPOINT}${PREFIX}/reportTemplate/getReportTemplateListById/${projectId}`,
		headers: { Authorization: `Bearer ${token}` }
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

const generateReportOverview = async (token, overview) => {
	console.log(overview);
	const options = {
		method: 'post',
		url: `${ENDPOINT}${PREFIX}/reportTemplate/generateReportOverview`,
		headers: { Authorization: `Bearer ${token}` },
		data: { overview }
	};
	return await axiosInstance
		.request(options)
		.then((res) => res.data)
		.catch((err) => err);
};

//*------------------------------------------------------------------------------

//!Exportaciones de grupos
const Service = {
	User: {
		getUserWithToken,
		getUserWithId,
		logOut
	},
	Project: {
		fetchProjects,
		getProjectDetail,
		submitBasicInfo,
		confirmsubmit,
		deleteProject,
		getProjectSubmittedList,
		projectVerify,
		projectReject,
	},
	Requests: {
		getAllPPs,
		getAllVVBs,
		getDetails,
		Approved,
		Denied,
		approvedVVbs
	},
	Structure: {
		getStructure,
		getOrgType,
		getCountryList,
		getDynamicList,
		onlyfordev
	},
	Reports: {
		getAllReportsList,
		getReportSubmittedList,
		generate,
		getProjectListHavingReport,
		getReportListByProjectId,
		submitReport,
		updateReport,
		getPendingReport,
		approveReport,
		rejectReport
	},
	ReportTemplate: {
		getReportTemplateList,
		createReportTemplateList,
		getReportTemplateListById,
		generateReportOverview
	}
};
export default Service;
//!-----------------------
