import React, {useEffect, useState} from 'react'
import moment from 'moment';
import { getEmployeePublicHoliday, getLeaveById} from './../../tunnel'

const LeaveList = props => {
  const [leaveList, setLeaveList] = useState([])
  const [employeePublicHolidayList, setEmployeePublicHolidayList] = useState([])


  useEffect(() => {
    getLeaveList()
  }, [])

  const getLeaveList = () => {
    getLeaveById({employeeId: props.employeeInfo.id}, res =>{
      if(res.status){
        console.log(res);
        setLeaveList(res.leaveList)
      }
    })
    getEmployeePublicHoliday({employeeId: props.employeeInfo.id}, res =>{
      if(res.status){
        console.log(res);
        setEmployeePublicHolidayList(res.employeePublicHolidayList)
      }
    })
  }

    const sortedItems = leaveList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Step 2: Group by year
    const groupedByYear = sortedItems.reduce((groups, item) => {
        const date = new Date(item.startDate)
        const year = date.getFullYear();
        if (!groups[year]) {
            groups[year] = [];
        }
        groups[year].push(item);
        return groups;
    }, {});




    const remainPublicHoliday = employeePublicHolidayList.filter(day => day.status === 'valid')


    return(
        <div className='row'>
          <style>
        {
          `
          .tooltiper {
            position: relative;

          }

          .tooltiper:hover {
            cursor: help;

          }

          /* Tooltiper text */
          .tooltiper .tooltiptext {
            visibility: hidden;
            width: 180px;
            background-color: black;
            color: #e3e3e3;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;

            /* Position the tooltip text - see examples below! */
            position: absolute;
            top: 50px;

            z-index: 1;
          }
          .tooltiper:hover .tooltiptext {
            visibility: visible;
          }
          `
        }
      </style>
            <div className='col-12 mb-2 text-start'>
                <h5><u>สิทธิการลาคงเหลือ</u></h5>
            </div>
            <div className='col-4 text-center'>
                <div style={{display: 'inline-block'}} className='tooltiper'>
                <h4 style={{color:'#0373fc'}}><b>{remainPublicHoliday.length}</b></h4>
                    <b>Extra</b>
                    <span className="tooltiptext">
                        <u>วันหยุดคงเหลือ</u>
                        <ul>
                          {remainPublicHoliday.map(day => <li style={{textAlign: 'left'}}>{day.name}</li>)}
                        </ul>
                      </span>
                </div>
            </div>
            <div className='col-4 text-center'>
                <h4 style={{color:'#0373fc'}}><b>{props.employeeInfo.remainSickLeaveDay}</b></h4>
                <b>ลาป่วย</b>
            </div>
            <div className='col-4 text-center'>
            <h4 style={{color:'#0373fc'}}><b>{props.employeeInfo.remainYearlyLeaveDay}</b></h4>
                <b>พักร้อน</b>
            </div>

            <div className='col-12 mt-4  text-start'>
                <h5><u>ประวัติการลา</u></h5>
            </div>
            <div className='col-12'>
            <table className='table table-striped'>
                    {
                        Object.keys(groupedByYear)
                        .sort((a, b) => b - a) // Sort years in ascending order
                        .map(year =>
                        <tbody>
                            <tr>
                                <th style={{ width: '15%'}} className="text-center" >วันที่หยุดในปี {year}</th>
                                <th style={{ width: '30%'}} className="text-center">รายละเอียด</th>
                                <th style={{ width: '15%'}} className="text-center">ประเภท</th>
                                <th style={{ width: '13%'}} className="text-center">ส่งคำร้องโดย</th>
                                <th style={{ width: '14%'}} className="text-center">วันที่บันทึก</th>
                                <th style={{ width: '13%'}} className="text-center">อนุมัติโดย</th>
                            </tr>
                            {
                                groupedByYear[year].map(leave =>
                                    <tr>
                                        <td style={{width: '15%'}} >{moment(leave.startDate).format('DD/MM/YYYY')}</td>
                                        <td style={{width: '30%'}}>{leave.remark}</td>
                                        <td style={{width: '15%'}}>{leave.type}</td>
                                        <td style={{width: '13%'}}>{leave.createBy}</td>
                                        <td style={{width: '14%'}}>{moment(leave.timestamp).format('DD/MM/YYYY')}</td>
                                        <td style={{width: '13%'}}>{leave.approveBy}</td>

                                    </tr>

                                )
                            }
                        </tbody>
                        )
                    }
                </table>
            </div>
        </div>
    )
}

export default LeaveList;
