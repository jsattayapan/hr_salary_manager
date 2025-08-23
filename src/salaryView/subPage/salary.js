import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { SiTicktick } from "react-icons/si";
import Select from 'react-select'
import { getEmployeeTimeScanById, submitEditSalary, addScheduleUpdateSalary, getSalaryByEmployeeId, saveEmployeeSalaryPayment} from './../../tunnel'
import { convertMinutes } from './helper'
import Swal from "sweetalert2";


const Salary = props => {
  const [includeSocialSecurity, setIncludeSocialSecurity] = useState({ value: false, label: 'ไม่ใช่' })
  const [timetableList, setTimetableList] = useState([])
  const [workingDay, setWorkingDay] = useState('')
  const [workingHour, setWorkingHour] = useState('')
  const [workingMinutes, setWorkingMinutes] = useState('')
  const [customDayOff, setCustomDayOff] = useState('')
  const [salary, setSalary] = useState(null)

  useEffect(() => {
    getTimetableByMonth(new Date())
    getSalary()
  },[])

  const getTimetableByMonth = (date) => {

    getEmployeeTimeScanById({employeeId: props.employeeInfo.id, month: date } ,res => {
        if(res.status){
          console.log(res.payload);
          setTimetableList( res.payload)

        }
      })
  }

  const getSalary = () => {
    getSalaryByEmployeeId({employeeId: props.employeeInfo.id } ,res => {
        if(res.status){
          setSalary(res.salaryList.find(list => list.active === 1))
        }
      })
  }

  const options = [
  { value: true, label: 'ใช่' },
  { value: false, label: 'ไม่ใช่' }
];
  let addAmount = 0
  let reduceAmount = 0
  for(const acc of props.employeeInfo.accountList){
    if(acc.type === 'เงินได้'){
      addAmount += acc.amount
    }
    if(acc.type === 'เงินหัก'){
      reduceAmount += acc.amount
    }
  }



  let totalMinutes = 0
  let totalDayOff = 0
  let totalExtraLeave = 0
  let totalSickLeave = 0
  let totalBusinessLeave = 0
  let totalDayForFullWork = 0
  for(const time of timetableList) {
    if(time.result === 'working'){
      totalMinutes += time.countableWorkingTime
    }
    if(time.result === 'dayOff'){
      totalDayOff += 1
    }
    if(time.result === 'leave'){
      if(time.leave.type === 'ลา Extra'){
        totalExtraLeave += 1
      }
      if(time.leave.type === 'ลาป่วย'){
        totalSickLeave += 1
      }
      if(time.leave.type === 'ลากิจ'){
        totalBusinessLeave += 1
      }
    }
  }

  totalDayForFullWork = timetableList.length - totalSickLeave - totalBusinessLeave - totalExtraLeave

  totalDayForFullWork -= customDayOff ? customDayOff : totalDayOff

  let getPaidAmount = 0
  let getPaidMinutes = 0
  let customWorkingMinutes = 0



  let workingTimeObject = convertMinutes(totalMinutes)
  let workingResultTimeObject = null
  let displayDayOff = 0


    let minuteRate = 0
  if(salary){
    minuteRate = (salary.salaryAmount + salary.positionAmount) / timetableList.length / 10 / 60

    if(workingDay === '' && workingHour === '' && workingMinutes === ''){
      getPaidMinutes += totalMinutes
      customWorkingMinutes += totalMinutes
    }else{
      getPaidMinutes += workingDay === '' ? workingTimeObject.day * 10 * 60 : parseInt(workingDay) * 10 * 60
      getPaidMinutes += workingHour === '' ? workingTimeObject.hours  * 60 : parseInt(workingHour)  * 60
      getPaidMinutes += workingMinutes === '' ? workingTimeObject.minutes   : parseInt(workingMinutes)


      customWorkingMinutes += workingDay === '' ? workingTimeObject.day * 10 * 60 : parseInt(workingDay) * 10 * 60
      customWorkingMinutes += workingHour === '' ? workingTimeObject.hours  * 60 : parseInt(workingHour)  * 60
      customWorkingMinutes += workingMinutes === '' ? workingTimeObject.minutes   : parseInt(workingMinutes)
    }


    getPaidMinutes += customDayOff === '' ? totalDayOff * 10 * 60 : parseInt(customDayOff) * 10 * 60
    getPaidMinutes += (totalExtraLeave + totalSickLeave +totalBusinessLeave) * 10 * 60

    getPaidAmount = minuteRate * getPaidMinutes


  }

  if(props.employeeInfo.workingMinutes !== null){
    workingResultTimeObject = convertMinutes(props.employeeInfo.workingMinutes)
    let dayOffPaid = props.employeeInfo.earning - ((((totalExtraLeave + totalSickLeave +totalBusinessLeave) * 10 * 60) + props.employeeInfo.workingMinutes) * minuteRate)
    dayOffPaid = dayOffPaid/minuteRate
    displayDayOff = convertMinutes(Math.round(dayOffPaid))
    console.log(dayOffPaid);
    console.log(displayDayOff);
  }

  const socialSecurity = includeSocialSecurity.value ? getPaidAmount * 5/100 : 0

  let totalSum = 0
  totalSum += Math.round(getPaidAmount)+addAmount-reduceAmount-Math.round(socialSecurity)

  const openSalarySettingPopup = () => {
    // build month list
    const months = [{ value: "now", label: "now" }];
   for (let i = 1; i < 7; i++) {
     months.push({
       value: moment().add(i, "months").format("MM/YYYY"),
       label: moment().add(i, "months").format("MMMM YYYY"),
     });
   }

   Swal.fire({
     title: "ปรับฐานเงินเดือน",
     html: `
       <input type="number" id="salary" class="swal2-input" placeholder="Salary">

       <input type="number" id="compensation" class="swal2-input" placeholder="Compensation (optional)">

       <label style="display:block; text-align:left; margin:10px 0 5px">รอบเดือนปรับ</label>
       <select id="monthYear" class="swal2-select" style="width:80%">
         ${months.map((m) => `<option value="${m.value}">${m.label}</option>`).join("")}
       </select>
     `,
     focusConfirm: false,
     showCancelButton: true,
     confirmButtonText: "Update",
     preConfirm: () => {
       const salary = document.getElementById("salary").value;
       const compensation = document.getElementById("compensation").value;
       const monthYear = document.getElementById("monthYear").value;

       if (!salary || !monthYear) {
         Swal.showValidationMessage("กรุณากรอก Salary และ รอบเดือนปรับ");
         return false;
       }

       return {
         salaryAmount: Number(salary),
         positionAmount: compensation ? Number(compensation) : 0,
         monthYear,
       };
     },
   }).then((result) => {
     if (result.isConfirmed && result.value) {
       // updatesalary now uses a callback
       if(result.value.monthYear === 'now'){
         submitEditSalary({...result.value, createBy: props.user.username, employeeId: props.employeeInfo.id}, (res) => {
           if (res.status === true) {
             Swal.fire("ทำการปรับฐานสำเร็จ");
             getSalary()
           } else {
             Swal.fire(res.msg || "เกิดข้อผิดพลาด");
           }
         });
       }else{
         addScheduleUpdateSalary({...result.value, createBy: props.user.username, employeeId: props.employeeInfo.id}, (res) => {
           if (res.status === true) {
             Swal.fire("ทำการปรับฐานสำเร็จ");
           } else {
             Swal.fire(res.msg || "เกิดข้อผิดพลาด");
           }
         });
       }

     }
   });
  }

  const handleSaveSalaryPaymentBtnClick = () => {
    Swal.fire({
      title: "ยืนยันการบันทึก?",
      text: "คุณต้องการบันทึกข้อมูลการจ่ายเงินเดือนหรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, บันทึกเลย",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        // เรียกฟังก์ชันจริง
        const payload = {
          monthYear: moment().locale("en").format('MMM/YYYY'),
          employeeId: props.employeeInfo.id,
          socialSecurity: Math.round(socialSecurity),
          earning: Math.round(getPaidAmount),
          compensation: 0,
          workingMinutes: customWorkingMinutes}
          console.log(payload);
        saveEmployeeSalaryPayment(payload,(res) => {
          console.log(res);
          if (res.status) {
            Swal.fire("สำเร็จ!", "ทำการบันทึกเรียบร้อยแล้ว", "success");
            props.refreshEmployeeList()
          } else {
            Swal.fire("ผิดพลาด!", res.msg || "ไม่สามารถบันทึกได้", "error");
          }
        })

      }
    });
}

  return (
    <div className="row text-start">
      <div className="col-12 text-end mb-4">
        <span>รอบเดือน: <b>{moment().format('MMMM YYYY')}</b></span>
      </div>
      <hr />
        <div className="col-12 text-end mb-2 ">
          <h5 className="text-start"><u>Salary Rate</u></h5>
          <span>ฐานเงินเดือน: <b>{salary ? salary.salaryAmount.toLocaleString(): 'xxx,xxx'}.-</b></span>
          <span style={{marginLeft: '20px'}}>ค่าตำแหน่ง: <b>{salary ? salary.positionAmount.toLocaleString(): 'xxx,xxx'}.-</b></span>
          <span style={{marginLeft: '20px'}}>อัพเดทเมื่อ: <b>{salary ? moment(salary.createAt).fromNow(): 'ไม่มีข้อมูล'}</b></span>
          <button onClick={openSalarySettingPopup} className="btn btn-sm btn-success mx-4">Update</button>
        </div>
        <hr />
        <div className="col-12 text-start ">
          <h5 className="text-start"><u>ชั่วโมงทำงาน</u></h5>
          <div className="row d-flex align-items-center">
            <div className="col-3">
              <span><b>ชั่วโมงทำงาน(เต็ม {totalDayForFullWork} วัน): </b></span>
            </div>
            <div className="col-2">
              <div className="input-group mb-3">
                <input  onChange={(e) => setWorkingDay(e.target.value)} value={props.employeeInfo.workingMinutes !== null ? workingResultTimeObject.day : workingDay} disabled={props.employeeInfo.workingMinutes !== null} placeholder={workingTimeObject.day} type="number" className="form-control" aria-label="Recipient’s username" aria-describedby="basic-addon2" />
                <span className="input-group-text" >วัน</span>
              </div>
            </div>
            <div className="col-2">
              <div className="input-group mb-3">
                <input value={props.employeeInfo.workingMinutes !== null ? workingResultTimeObject.hours : workingHour} disabled={props.employeeInfo.workingMinutes !== null} onChange={(e) => setWorkingHour(e.target.value)} placeholder={workingTimeObject.hours} type="number" className="form-control"  aria-label="Recipient’s username" aria-describedby="basic-addon2" />
                <span className="input-group-text">ชม.</span>
              </div>
            </div>
            <div className="col-2">
              <div className="input-group mb-3">
                <input value={props.employeeInfo.workingMinutes !== null ? workingResultTimeObject.minutes : workingMinutes} disabled={props.employeeInfo.workingMinutes !== null} onChange={(e) => setWorkingMinutes(e.target.value)} placeholder={workingTimeObject.minutes} type="number" className="form-control"  aria-label="Recipient’s username" aria-describedby="basic-addon2" />
                <span className="input-group-text" >นาที</span>
              </div>
            </div>
            <div className="col-2 mb-3">
              <SiTicktick color="green" size="30px" />
            </div>
          </div>
        </div>
        <div className="col-12 text-start">
          <div className="row d-flex align-items-center">
            <div className="col-3">
              <span><b>วันหยุดประจำสัปดาห์:</b> </span>
            </div>
            <div className="col-2">
              <div className="input-group mb-3">
                <input value={props.employeeInfo.workingMinutes !== null ? displayDayOff.day : customDayOff} disabled={props.employeeInfo.workingMinutes !== null} onChange={(e) => setCustomDayOff(e.target.value)} placeholder={totalDayOff} type="number" className="form-control" aria-label="Recipient’s username" aria-describedby="basic-addon2" />
                <span className="input-group-text" >วัน</span>
              </div>
            </div>
            <div className="col-1 mb-3">
              <SiTicktick color="green" size="30px" />
            </div>
          </div>
          <div className="row">
            <div className="col-3 mb-3">
              <span><b>จ่ายประกันสังคม:</b> </span>
            </div>
            <div className="col-2 mb-3">
              <Select isDisabled={props.employeeInfo.workingMinutes !== null} value={props.employeeInfo.socialSecurity > 0 ? { value: true, label: 'ใช่' } : { value: false, label: 'ไม่ใช่' }} onChange={(e) => setIncludeSocialSecurity(e)} options={options} />
            </div>
          </div>
        </div>

        <hr />
        <h5 className="text-start"><u>บัญชีรอบเดือน</u></h5>
          <div className="col-6">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th style={{width: '70%'}}>เงินได้</th>
                  <th style={{width: '15%'}}>ยอด</th>
                  <th style={{width: '15%'}}>บันทึก</th>
                </tr>
              </thead>
              <tbody>
                {
                  props.employeeInfo.accountList.filter(acc => acc.type === 'เงินได้').map(acc => (
                    <tr>
                      <td>{acc.remark}</td>
                      <td>{acc.amount}.-</td>
                      <td>{acc.createBy}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        <div className="col-6">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{width: '70%'}}>เงินหัก</th>
                <th style={{width: '15%'}}>ยอด</th>
                <th style={{width: '15%'}}>บันทึก</th>
              </tr>
            </thead>
            <tbody>
              {
                props.employeeInfo.accountList.filter(acc => acc.type === 'เงินหัก').map(acc => (
                  <tr>
                    <td>{acc.remark}</td>
                    <td>{acc.amount}.-</td>
                    <td>{acc.createBy}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <hr />
        <h5 className="text-start"><u>สรุปเงินรอบเดือน</u></h5>
        <div className="col-6 my-1 text-end">
          <div className="row">
            <div className="col-12">
              <span>เงินเดือน: <b style={{color: 'green'}}>{parseInt(getPaidAmount).toLocaleString()} บาท</b></span>
            </div>
            {addAmount ? <div className="col-12">
              <span>เงินได้: <b style={{color: 'green'}}>{addAmount} บาท</b></span>
            </div>: ''}
            <div className="col-12">
              <span>เงินหัก: <b style={{color: 'red'}}>{reduceAmount} บาท</b></span>
            </div>
            <div className="col-12">
              <span>ประกันสังคม: <b style={{color: 'red'}}>{Math.round(socialSecurity).toLocaleString()} บาท</b></span>
            </div>
            <div className="col-12">
              <span>สรุป: <b style={{color: 'green'}}>{parseInt(totalSum).toLocaleString()} บาท</b></span>
            </div>
          </div>
        </div>
        <div className="col-6 text-end my-1">
          <div className="row">
            <div className="col-12">
              <span>วันหยุด: <b>{customDayOff === '' ? totalDayOff : customDayOff}</b> วัน</span>
            </div>
            <div className="col-12">
              <span>ลาป่วย: <b>{totalSickLeave}</b> วัน</span>
            </div>
            <div className="col-12">
              <span>ลาExtra: <b>{totalExtraLeave}</b> วัน</span>
            </div>
            <div className="col-12">
              <span>ลากิจ: <b>{totalBusinessLeave}</b> วัน</span>
            </div>
          </div>
        </div>
        <div className="col-12 text-end my-1">
          {props.employeeInfo.workingMinutes !== null ?
            <button className="btn btn-info">พิมพ์สลิปเงินเดือน</button>
            :
            <button onClick={handleSaveSalaryPaymentBtnClick} className="btn btn-success">บันทึกสรุปเงินเดือน</button>
          }

        </div>
    </div>
  )
}

export default Salary
