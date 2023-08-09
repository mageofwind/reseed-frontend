import Home from "./home/home";
import Projects1 from "./projects/projects";
import Requests from "./all_requests/all_requests";
import PersonalInfo from "./personal_info/personal_info"
import EmailSettings from "./email/email"
import DataPrivacy from "./dataprivacy/dataprivacy"
import CreateProjects from "./create/create"
import Reports from "./reports/reports"
import CreateReport from "./createReport/create_report"
import PendingReports from "./reports/getPendingReports"
import getSubmittedProject from './projects/getSubmittedProject'
import reportTemplate from './reportTemplates/reportTemplate'

const internal_pages = {
    Home, Projects: Projects1, Requests, PersonalInfo, EmailSettings, DataPrivacy, CreateProjects, Reports, CreateReport, PendingReports, getSubmittedProject, reportTemplate
}
export default internal_pages