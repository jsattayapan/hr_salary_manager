import React, {useState, useEffect} from 'react'
import moment from 'moment'
import SummaryDashboard from './summaryDashboard'
import {getDepartments, getEmployeeListForHr,getEmployeeListForPayroll, ipAddress} from '../tunnel'
import Profile from './employeeProfile'


const Container = props => {

  const [departmentList, setDepartmentList] = useState([])
  const [employeeList, setEmployeeList] = useState([])
  const [noOfEmployee, setNoOfEmployee] = useState(0)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
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
  getEmployeeListForPayroll({monthYear: new Date()}, res => {
    if(res.status){
      console.log(res);
      setEmployeeList(res.list.filter(emp => emp.active === 1))
      setNoOfEmployee(res.list.filter(emp => emp.active === 1).length)
    }
  })
}

const refreshEmployeeList = async () => {
  getEmployeeListForPayroll({monthYear: new Date()}, res => {
    if(res.status){
      const newList = res.list.filter(emp => emp.active === 1)
      setEmployeeList(newList)
      setSelectedEmployee(newList.find(emp => emp.id === selectedEmployee.id))
    }
  })
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


  const  convertMinutesToDHrMin = (totalMinutes) => {
  if (totalMinutes < 0) {
    return 'Invalid input: Minutes cannot be negative.';
  }

  const days = Math.floor(totalMinutes / (60 * 10));
  const remainingMinutesAfterDays = totalMinutes % (60 * 10);
  const hours = Math.floor(remainingMinutesAfterDays / 60);
  const minutes = remainingMinutesAfterDays % 60;

  let result = '';
  if (days > 0) {
    result += `${days}D `;
  }
  if (hours > 0) {
    result += `${hours}Hr `;
  }
  if (minutes > 0) {
    result += `${minutes}Min`;
  }

  // Handle case where totalMinutes is 0
  if (totalMinutes === 0) {
    return '0Min';
  }

  return result.trim();
}

const handleEmployeeOnClick = (employeeId) => {
  setSelectedEmployee(employeeList.find(emp => emp.id === employeeId))
}

const backBtn = () => {
  setSelectedEmployee(null)
}

let sumWorkingHour = 0
let sumEarning = 0
let payCom = 0
let sumReceive = 0
let sumExpense = 0
let sumBenefit = 0
let sumPosition = 0
let sumSocialSecurity = 0

for(const emp of employeeList){
  sumWorkingHour += emp.workingMinutes ? emp.workingMinutes : 0
  sumEarning += emp.earning ? emp.earning : 0
  sumBenefit += emp.benefitPaid ? emp.benefitPaid : 0
  sumPosition += emp.compensation ? emp.compensation : 0
  sumSocialSecurity += emp.socialSecurity ? emp.socialSecurity : 0
  sumExpense += emp.workingMinutes ? emp.accountList.reduce((total, ea) => ea.type === 'เงินหัก' ? total + ea.amount : total , 0) : 0
  sumReceive += emp.workingMinutes ?emp.accountList.reduce((total, ea) => ea.type === 'เงินได้' ? total + ea.amount : total, 0) : 0
}

const  listTable = (
  <div className="row">
      <div>
        <SummaryDashboard
          noOfEmployee={noOfEmployee}
          sumWorkingHour={convertMinutesToDHrMin(sumWorkingHour)}
          sumEarning={sumEarning}
          sumSalayNet={sumEarning}
          sumExpense={sumExpense}
          sumReceive={sumReceive}
          sumBenefit={sumBenefit}
          sumPosition={sumPosition}
          sumSocialSecurity={sumSocialSecurity}
        />
      </div>
      <div className='col-12'>
         <table className="table table-striped">
           <tbody>
             {
                departmentList.map(dept => <React.Fragment key={dept.id}>
                  <tr style={{fontSize: '13px'}}>
                    <td className="text-start" colSpan="2"><h3><b>{dept.name}</b></h3></td>
                    <th style={{width: '10%'}}>ชั่วโมงทำงาน</th>
                    <th style={{width: '10%'}}>เงินเดือน</th>
                  <th style={{width: '10%'}}>เงินได้</th>
                  <th style={{width: '10%'}}>ปกสค.</th>
                  <th style={{width: '10%'}}>เงินหัก</th>
                  <th style={{width: '10%'}}>Net Pay</th>
                <th style={{width: '5%'}}></th>
                  </tr>
             {
               employeeList.filter(emp => emp.departmentId === dept.id).map(emp => {
                  let duration = getDurationFromNow(emp.startJob)

                    let expense = emp.accountList.reduce((total, ea) => {
                      if(ea.type === 'เงินหัก'){
                        total = total + ea.amount
                      }
                      return total
                    }, 0)

                    let receive = emp.accountList.reduce((total, ea) => {
                      if(ea.type === 'เงินได้'){
                        total = total + ea.amount
                      }
                      return total
                    }, 0)

                  return (
                  <tr style={{ fontSize: '13px'}}>
                    <td className="align-middle" style={{width: '10%'}}><b>{emp.id}</b></td>
                    <td className="text-start" style={{width: '25%'}}>
                      <div className="row">
                        <div className="col-2">
                          <img
                            src={emp.imageUrl ? ipAddress + '/public/employee/' + emp.imageUrl : ipAddress + '/public/employee/person.png'}
                            className={emp.active ? "personIconActive" : "personIconInactive"}
                            alt="Smiley face"
                            height="40"
                            width="40" />
                        </div>
                        <div className="col-10">
                          <div className="col-12">
                            <b>{emp.name}</b>
                          </div>
                          <div className="col-12">
                            {emp.departmentName} - {emp.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle" style={{width: '10%'
                     }}>{emp.workingMinutes ? convertMinutesToDHrMin(emp.workingMinutes) : '-' }</td>
                    <td className="align-middle" style={{width: '10%',
                      color: emp.workingMinutes ? 'green': 'black'}}>{emp.earning ? '฿' + emp.earning.toLocaleString() : '-' }</td>
                  <td className="align-middle" style={{width: '10%',
                    color: (receive
                    + emp.compensation
                    + emp.benefitPaid) ? 'green': 'black'}}>
                    {(
                    receive
                    + emp.compensation
                    + emp.benefitPaid
                  ) ? '฿' + (
                  receive
                  + emp.compensation
                  + emp.benefitPaid
                ).toLocaleString() : '-' }</td>
                      <td className="align-middle" style={{width: '10%', color: 'red'}}>{emp.socialSecurity ? '฿' + emp.socialSecurity : '-' }</td>
                    <td className="align-middle" style={{width: '10%', color: 'red'}}>{emp.workingMinutes ? '฿' + expense.toLocaleString() : '-'}</td>
                    <td className="align-middle text-center" style={{width: '10%', color: 'green'}}><b>{emp.workingMinutes ? '฿' + (emp.earning + emp.benefitPaid+  emp.compensation + receive - emp.socialSecurity - expense).toLocaleString() : '-' }</b></td>
                    <td className="align-middle" style={{width: '5%'}}>
                      <button onClick={() => handleEmployeeOnClick(emp.id)} className="btn btn-link mx-1">View</button>
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



  return (
    selectedEmployee ?
  <Profile refreshEmployeeList={refreshEmployeeList} employeeInfo={selectedEmployee} backBtn={backBtn} user={props.user} />
  : listTable
  )
}

export default Container
