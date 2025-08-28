import React, {useState, useEffect} from 'react'
import {ipAddress} from './../tunnel'
import moment from 'moment'
import {
  FiArrowLeft,
  FiPhone,
  FiCoffee,
  FiUser,
  FiCopy,
  FiClipboard,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiMap,
  FiGlobe
} from "react-icons/fi";

import {
  FaBirthdayCake
} from "react-icons/fa";

import Timetable from './subPage/timetable'
import Leave from './subPage/leave'

import Salary from './subPage/salary'
import EmpAccount from './subPage/empAccount'
import Document from './subPage/document'

import Warning from './subPage/warning'
import Notes from './subPage/notes'



 const Profile = props => {
   const [subPage, setSubPage] = useState('Salary')
  const {employeeInfo} = props
  const days = [
      'วันอาทิตย์', // 1
      'วันจันทร์',   // 2
      'วันอังคาร',   // 3
      'วันพุธ',      // 4
      'วันพฤหัสบดี', // 5
      'วันศุกร์',    // 6
      'วันเสาร์'     // 7
    ];
    let subPageList = ['Salary', 'ตารางเวลา', 'ประวัติการลา' , 'บัญชี', 'เอกสาร', 'ใบเตือน', 'Notes']

  const empInfoSection = (
    <div className="col-3 text-start px-2">
    <img
      src={employeeInfo.imageUrl ? ipAddress + '/public/employee/' + employeeInfo.imageUrl : ipAddress + '/public/employee/person.png'}
      className={employeeInfo.active ? "personIconActive" : "personIconInactive"}
      alt="Smiley face"
      height="80"
      width="80" />
    <p style={{fontSize: '18px', marginTop: '10px'}}><b>{employeeInfo.name}</b></p>
    <hr />
      <div className="row">
    <div className="col-12">
      <h4><u>ข้อมูลการทำงาน</u></h4>
    </div>


    <TextField title='ID' value={employeeInfo.id} icon={<FiUser />} />
    <TextField title='เริ่มทำงาน' value={employeeInfo.startJob} icon={<FiCalendar />} />
    <TextField title='อายุงาน' value={getDuration(employeeInfo.startJob)} icon={<FiFileText />} />

    <TextField title='Department' value={employeeInfo.departmentName} icon={<FiCopy />} />
    <TextField title='ตำแหน่ง' value={employeeInfo.role} icon={<FiClipboard />} />


    <div className="col-12">

      <TextField title='วันหยุดประจำสัปดาห์' value={days[employeeInfo.defaultDayOff - 1]} icon={<FiCoffee />}
    />

    </div>

    <TextField title='บัญชีรับเงินเดือน' value={employeeInfo.bankAccount}  icon={<FiDollarSign />}
    />
  <div className='mt-3'></div>
  <hr />
    <div className="col-12">
      <h5>ข้อมูลส่วนตัว</h5>
    </div>
    <TextField title='หมายเลขประชาชน/พาสปอร์ต' value={employeeInfo.nationalId}  icon={<FiUser />}

    />
    <TextField title='เบอร์โทร' value={employeeInfo.phone}
      icon={<FiPhone />}
    />
  <TextField title='ที่อยู่' value={employeeInfo.address}  icon={<FiMap />}
    />
  <TextField title='วันเกิด' value={employeeInfo.dob} icon={<FaBirthdayCake />}
    />


  <TextField title='สัญชาติ' value={employeeInfo.nationality} icon={<FiGlobe />} />
  </div>
  </div>
  )
  return (
    <div className="row">
      <div className="col-3 d-flex align-items-center justify-content-start my-2">
        <button className="btn" onClick={props.backBtn}><FiArrowLeft /></button>
        <b>Employee Profile</b>
      </div>
      <div className="col-9">
        <ul className="mt-2">
        {
          subPageList.map(page => <SubMenuList onClick={setSubPage} text={page} subPage={subPage}/>)
        }
      </ul>
      </div>
      <hr />
      <div className="col-12">
        <div className="row">
          { empInfoSection}
          <div className="col-9">

          {
            subPage === 'ตารางเวลา' ? <Timetable employeeInfo={employeeInfo} user={props.user} refreshEmployeeList={props.refreshEmployeeList} /> : ''
          }

          {
            subPage === 'ประวัติการลา' ? <Leave employeeInfo={employeeInfo} /> : ''
          }
          {
            subPage === 'Salary' ? <Salary refreshEmployeeList={props.refreshEmployeeList} employeeInfo={employeeInfo} user={props.user} /> : ''
          }
          {
            subPage === 'บัญชี' ? <EmpAccount refreshEmployeeList={props.refreshEmployeeList} employeeInfo={employeeInfo} user={props.user} /> : ''
          }

          {
            subPage === 'เอกสาร' ? <Document employeeInfo={employeeInfo} user={props.user} /> : ''
          }
          {
            subPage === 'ใบเตือน' ? <Warning employeeInfo={employeeInfo} user={props.user} /> : ''
          }

          {
            subPage === 'Notes' ? <Notes employeeInfo={employeeInfo} user={props.user} /> : ''
          }

          </div>
        </div>
      </div>
    </div>
  )
}

const SubMenuList = props => (
  <li
    className="subMenuLi"
    onClick={() => props.onClick(props.text)}
    style={{cursor:'pointer',position: 'relative', display: 'inline', padding: '13px', borderBottom: props.text === props.subPage ? '4px solid orange': ''}}
    >
    {props.text}



  </li>
)

const getDuration = (inputDate) => {
  // Parse the input date string with the specified format
  const startDate = moment(inputDate, 'DD/MM/YYYY');
  const today = moment();

  // Validate the date
  if (!startDate.isValid()) {
    return 'Invalid date format. Please use DD/MM/YYYY.';
  }

  // Calculate the difference in milliseconds
  const diffInMilliseconds = today.diff(startDate);

  // Use moment.duration() to get the human-readable breakdown
  const duration = moment.duration(diffInMilliseconds);

  // Extract years, months, and days
  const years = duration.years();
  const months = duration.months();
  const days = duration.days();

  // Build the output string
  let result = [];
  if (years > 0) {
    result.push(`${years} ปี`);
  }
  if (months > 0) {
    result.push(`${months} เดือน`);
  }
  if (days > 0) {
    result.push(`${days} วัน`);
  }

  // Handle the case of zero duration
  if (result.length === 0) {
    return '0 วัน';
  }

  return result.join(' ');
}

const TextField = props => (
  <div className="col-12 text-field-updatable" style={{fontSize: '14px'}}>
     <style>
        {`
          .text-field-updatable .action-btn {
            visibility: hidden;
          }

          .text-field-updatable:hover .action-btn {
            visibility: visible;
          }
        `}
      </style>
    <label>{props.icon} {props.title} : </label>&nbsp;<b>{props.value || '-'}</b>
  </div>
)

export default Profile
