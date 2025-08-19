import React, {useState, useEffect} from 'react'
import moment from 'moment'
import {getDepartments, getEmployeeListForHr, ipAddress} from '../tunnel'


const Container = props => {

  const [departmentList, setDepartmentList] = useState([])
  const [employeeList, setEmployeeList] = useState([])
  useEffect(() => {
    getDepartmentList()
    getEmployeeList()
}, []);

const getDepartmentList = () => {
  getDepartments(res => {
    if(res.status){
      setDepartmentList(res.departments)
    }
  })
}

const getEmployeeList = () => {
  getEmployeeListForHr({}, res => {
    if(res.status){
      console.log(res);
      setEmployeeList(res.list.filter(emp => emp.active === 1))
    }
  })
}

const setEmployee = () => {

}

const getDurationFromNow = (dateString) => {
    // Parse the date string with the format 'DD/MM/YYYY'
    const inputDate = moment(dateString, 'DD/MM/YYYY');

    // Get the current date
    const now = moment();

    // Calculate the difference in years, months, and days
    const years = now.diff(inputDate, 'years');
    inputDate.add(years, 'years');

    const months = now.diff(inputDate, 'months');
    inputDate.add(months, 'months');

    const days = now.diff(inputDate, 'days');

    // Return the duration
    return { years, months, days };
  }



  return (
    <div className="row">
      <div className='col-12'>
         <table className="table table-bordered">
           <thead>
             <tr>
               <th style={{width: '10%'}}>รหัสพนักงาน</th>
               <th style={{width: '5%'}}>ระดับ</th>
               <th style={{width: '35%'}}>พนักงาน</th>
               <th style={{width: '15%'}}>อายุงาน</th>
               <th style={{width: '15%'}}>เบอร์โทร</th>
             <th style={{width: '10%'}}>ประมวลเงินเดือน</th>
           <th style={{width: '5%'}}></th>
             </tr>
           </thead>
           <tbody>
             {
                departmentList.map(dept => <React.Fragment key={dept.id}>
                  <tr>
                    <td colSpan="7"><h3><b>{dept.name}</b></h3></td>
                  </tr>
             {
               employeeList.filter(emp => emp.departmentId === dept.id).map(emp => {
                  let duration = getDurationFromNow(emp.startJob)
                    let background = '#fff'
                    if(emp.performanceStatus === 'Good'){
                        background = '#90EE90'
                    }
                    if(emp.performanceStatus === 'Average'){
                        background = '#FFFACD'
                    }
                    if(emp.performanceStatus === 'Poor'){
                        background = '#FFB6B6'
                    }
                    if(emp.performanceStatus === 'Fail'){
                        background = '#D3D3D3'
                    }

                  return (
                  <tr style={{background}}>
                    <td className="align-middle" style={{width: '10%'}}>{emp.id}</td>
                    <td className="align-middle text-center" style={{width: '5%'}}><b>{emp.level}</b></td>
                    <td className="align-middle" style={{width: '35%'}}>
                      <div className="row">
                        <div className="col-2">
                          <img
                            src={emp.imageUrl ? ipAddress + '/public/employee/' + emp.imageUrl : ipAddress + '/public/employee/person.png'}
                            className={emp.active ? "personIconActive" : "personIconInactive"}
                            alt="Smiley face"
                            height="60"
                            width="60" />
                        </div>
                        <div className="col-10">
                          <div className="col-12">
                            {emp.name}
                          </div>
                          <div className="col-12">
                            {emp.departmentName} - {emp.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle" style={{width: '15%'}}>{`${duration.years ? `${duration.years}y` : ''} ${duration.months ? `${duration.months}m` : ''} ${duration.days}d`}</td>
                    <td className="align-middle" style={{width: '15%'}}>{emp.phone}</td>
                    <td className="align-middle text-center" style={{width: '5%'}}>{emp.nationality}</td>
                    <td className="align-middle" style={{width: '15%'}}>
                      <button onClick={() => setEmployee(emp.id)} className="btn btn-link mx-1">ดูโปรไฟล์</button>
                    </td>
                  </tr>
                )})
             }
             </React.Fragment>)
           }
           </tbody>
         </table>
       </div>
    </div>
  )
}

export default Container
