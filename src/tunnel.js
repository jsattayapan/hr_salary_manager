import axios from 'axios';

export const ipAddress = 'http://192.168.100.75:2225'

export const getDepartments = (callback) => {
  makeGetRequest('hr/getDepartments', res => callback(res))
}

export const getEmployeeListForHr = (data, callback) => {
  makePostRequest('hr/getEmployeeListForHr', data, res => callback(res))
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
  getEmployeeListForHr
}
