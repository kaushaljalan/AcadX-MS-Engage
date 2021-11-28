import axios from 'axios';
import { auth } from './firebase';

const api = () => {
	const inst = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
	});
	inst.interceptors.request.use(async config => {
		return new Promise((resolve, reject) => {
			auth.onAuthStateChanged(user => {
				if (!user) resolve(config)
				user?.getIdToken().then(token => {
					config.headers.authorization = `Bearer ${token}`
					return resolve(config)
				})
			})
		})
	}, (error) => {
		return Promise.reject(error)
	});
	return inst;
};

export const register = ({ email, password, name, department }) => api().post('/users', { email, password, name, department });
export const getDepartments = () => api().get('/departments');
export const createClass = ({
	name,
	details,
	modeOfDelivery,
	department,
	date,
	slot,
	attachments
}) => api().post('/classes', {
	name,
	details,
	modeOfDelivery,
	department,
	date,
	slot,
	attachments
});

export const getUpcomingClasses = () => api().get('/classes', {});
export const getTeachers = () => api().get('/users/teachers', {});
export const getPreferredSlots = () => api().get('/preferred-slots');
export const updatePreferredSlots = ({ modeOfDelivery, id }) => api().patch(`/preferred-slots/${id}`, { modeOfDelivery });
export const createPreferredSlots = ({ slot, weekDay, modeOfDelivery, id }) =>
	api().post(`/preferred-slots`, { modeOfDelivery, slot, weekDay, });
export const deletePreferredSlots = (id) => api().delete(`/preferred-slots/${id}`);
export const getUpcomingPreferredClasses = (query) => api().get('/booked-slots', { params: query });
export const getStudents = () => api().get('/users/basic')

export const createAssignment = (data) => api().post('/assignments', data);
export const getAssignments = () => api().get('/assignments');
export const getAssignmentSubmissions = (query) => api().get('/assignment-submissions', {
	params: query,
	
});
export const submitAssignment = ({ answers, assignment, attachments }) => api().post('/assignment-submissions', {
	answers,
	assignment,
	attachments
});

export const gradeAssignment = ({ grades, submissionId }) =>
	api().patch(`/assignment-submissions/${submissionId}/grade`, {
	grades,
});