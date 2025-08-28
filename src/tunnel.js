import axios from 'axios';

export const ipAddress = 'http://192.168.100.75:2225'
// export const ipAddress = 'https://tunit3-samed.ap.ngrok.io'

export const getDepartments = (callback) => {
  makeGetRequest('hr/getDepartments', res => callback(res))
}

export const getEmployeeListForHr = (data, callback) => {
  makePostRequest('hr/getEmployeeListForHr', data, res => callback(res))
}

export const getEmployeeListForPayroll = (data, callback) => {
  makePostRequest('hr/getEmployeeListForPayroll', data, res => callback(res))
}


export const getEmployeeTimeScanById = (data, callback) => {
  makePostRequest('hr/getEmployeeTimeScanById', data, res => callback(res))
}


export const getLeaveById = (data, callback) => {
  makePostRequest('hr/getLeaveById', data, res => callback(res))
}


export const getSalaryByEmployeeId = (data, callback) => {
  makePostRequest('hr/getSalaryByEmployeeId', data, res => callback(res))
}


export const submitEditSalary = (data, callback) => {
  makePostRequest('hr/submitEditSalary', data, res => callback(res))
}


export const addScheduleUpdateSalary = (data, callback) => {
  makePostRequest('hr/addScheduleUpdateSalary', data, res => callback(res))
}

export const submitEmployeeAccount = (data, callback) => {
  makePostRequest('hr/submitEmployeeAccount', data, res => callback(res))
}

export const getEmployeePublicHoliday = (data, callback) => {
  makePostRequest('deptManager/getEmployeePublicHoliday', data, res => callback(res))
}


export const saveEmployeeSalaryPayment = (data, callback) => {
  makePostRequest('hr/saveEmployeeSalaryPayment', data, res => callback(res))
}





export const getEmployeeAccountById = (data, callback) => {
  makePostRequest('hr/getEmployeeAccountById', data, res => callback(res))
}

export const deleteEmployeeAccount = (data, callback) => {
  makePostRequest('hr/deleteEmployeeAccount', data, res => callback(res))
}


export const submitLeaveByPayroll = (data, callback) => {
  makePostRequest('hr/submitLeaveByPayroll', data, res => callback(res))
}

export const submitNoteToEmployee = (data, callback) => {
  makePostRequest('hr/submitNoteToEmployee', data, res => callback(res))
}


export const deleteEmployeeNoteByNoteId = (data, callback) => {
  makePostRequest('hr/deleteEmployeeNoteByNoteId', data, res => callback(res))
}


export const getEmployeeNoteListById = (data, callback) => {
  makePostRequest('hr/getEmployeeNoteListById', data, res => callback(res))
}

export const getEmployeeSalaryReceipt = (data, callback) => {
  makePostRequest('hr/getEmployeeSalaryReceipt', data, res => callback(res))
}


export const submitEmployeeTimetable = (data, callback) => {
  makePostRequest('deptManager/submitEmployeeTimetable', data, res => callback(res))
}


export const deleteEmployeeTimetable = (data, callback) => {
  makePostRequest('deptManager/deleteEmployeeTimetable', data, res => callback(res))
}

export const submitemployeeDayOff = (data, callback) => {
  makePostRequest('deptManager/submitemployeeDayOff', data, res => callback(res))
}

export const submitDocument = (data, callback) => {
  const formData = new FormData();
  formData.append('employeeId', data.employeeId);
  formData.append('name', data.filename);
  formData.append('imageFile', data.file);
  makePostRequest('hr/submitDocument', formData, res => callback(res))
}


export const getEmployeeDocumentById = (data, callback) => {
  makePostRequest('hr/getEmployeeDocumentById', data, res => callback(res))
}


export const updateWarningApprove = (data, callback) => {
  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('imageFile', data.imageFile);
  makePostRequest('hr/updateWarningApprove', formData, res => callback(res))
}


export const getWarningById = (data, callback) => {
  makePostRequest('hr/getWarningById', data, res => callback(res))
}



function makePostRequest(route, data, callback){
  axios.post(`${ipAddress}/${route}`, data).then(res => {
     callback(res.data)
  }).catch(e => {
    console.log(e);
    callback({status: false, msg: 'ไม่สามารถเชื่อมต่อ Server ได้'})
  })
}

function makeGetRequest(route, callback){
  axios.get(`${ipAddress}/${route}`).then(res => {
     callback(res.data)
  }).catch(e => {
    console.log(e);
    callback({status: false, msg: 'ไม่สามารถเชื่อมต่อ Server ได้'})
  })
}

export default {
  getDepartments,
  getEmployeeListForHr,
  getEmployeeTimeScanById
}
