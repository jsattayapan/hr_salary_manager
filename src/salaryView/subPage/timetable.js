
import React, {useEffect, useState, useRef} from 'react'
import {convertMinutesToWord, minutesToDisplay} from './helper'
import moment from 'moment'
import 'moment/locale/th';
import { getEmployeeTimeScanById} from './../../tunnel'
import { FaEllipsisV, FaCalendarTimes } from 'react-icons/fa';
import { FiCoffee } from 'react-icons/fi';

const smallText = {fontSize: '14px', lineHeight: 0.8}

const Timetable = props => {
    let [timetableList, setTimetableList] = useState([]);
    const [menuState, setMenuState] = useState({ isVisible: false, index: null });
    const menuRef = useRef(null); // Create a ref for the popup menu



    useEffect(() => {
        moment.locale('th');
        getTimetableByMonth(new Date())
      }, []);

      const getTimetableByMonth = (date) => {

        getEmployeeTimeScanById({employeeId: props.employeeInfo.id, month: date } ,res => {
            if(res.status){
              console.log(res.payload);
              setTimetableList( res.payload)
            }
          })
      }





    let totalMinutes = 0
    let totalDayOff = 0
    let totalLeave = 0
    let totalDayForFullWork = 0
    for(const time of timetableList) {
      if(time.result === 'working'){
        totalMinutes += time.countableWorkingTime
      }
      if(time.result === 'dayOff'){
        totalDayOff += 1
      }
      if(time.result === 'leave'){
        totalLeave += 1
      }
    }

    totalDayForFullWork = timetableList.length - totalDayOff - totalLeave


    return (
        <div className='row'>
            <div className='col-12 text-end'>
                <MonthSelector getTimetableByMonth={getTimetableByMonth} />
                <label><FiCoffee /> วันหยุด: <b>{totalDayOff} วัน</b></label>
                <br />
                <label> <FaCalendarTimes /> ใช้สิทธิ์ลา: <b>{totalLeave} วัน</b></label>
            <div style={{}}>
                <table className='table table-bordered table-striped '>
                    <thead>
                        <tr>
                            <th>วันที่</th>
                            <th>เข้า</th>
                            <th>พัก</th>
                            <th>กลับเข้า</th>
                            <th>ออก</th>
                            <th>ชั่วโมงทำงาน: {convertMinutesToWord(totalMinutes)} / {totalDayForFullWork} วัน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            timetableList.map((time, index) => {
                                let result = setDateAndSumCol(time)

                                return (
                                    <tr style={{minHeight: 60}}>
                                        <td>{`${time.date}`}<br/>
                                        <ul style={{listStyleType: 'none', padding: '0', margin: '0'}}>
                                          {result.dateCol.map(de => <li><b>{de}</b></li>)}
                                          </ul></td>
                                        <td>{`${time.start ? time.start.time : '-'}`}</td>
                                        <td>{`${time.break ? time.break.time : '-'}`}</td>
                                        <td>{`${time.continue ? time.continue.time : '-'}`}</td>
                                        <td>{`${time.end ? time.end.time : '-'}`}</td>
                                        <td>
                                        <ul style={{listStyleType: 'none', padding: '0', margin: '0'}}>
                                          {result.sumCol.map(de => <li><b>{de}</b></li>)}
                                          </ul></td>


                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    )
}





// Example:












const setDateAndSumCol = x => {
    let dateCol = []
    let sumCol = []
    if(x.result === 'leave'){
      dateCol = [x.leave.type]
      sumCol = [x.remark]
      return {dateCol, sumCol}
    }

    if(x.timetable === undefined){
      dateCol = ['(-)']
      sumCol = ['***']
      return {dateCol, sumCol}
    }

    if(x.result === 'uncountable'){
      dateCol = [...dateCol, '']
      sumCol = [...sumCol,'***']
    }



    if(x.result === 'dayOff'){
      dateCol = [...dateCol, 'วันหยุด']
      sumCol = [...sumCol,'วันหยุดประจำสัปดาห์']
    }
    if(x.result === 'dayOff+OT'){
        dateCol = [...dateCol, 'วันหยุด']
      sumCol = ['วันหยุดประจำสัปดาห์' , ` OT: ${minutesToDisplay(x.countableOTTime)}`]
    }

    if(x.result === 'working' || x.result === 'working+OT'){
      sumCol = [...sumCol,'SW: '+minutesToDisplay(x.countableWorkingTime)]
      if(x.workDuration - x.countableWorkingTime > 0){
        sumCol = [...sumCol,'สาย/ออกก่อน: '+minutesToDisplay(x.workDuration - x.countableWorkingTime)]
      }


    }

    if(x.timetable.startTime !== null){
      if(x.timetable.breakTime === null){
        dateCol = [...dateCol, `(${moment(x.timetable.startTime).format('kk:mm')} - ${moment(x.timetable.endTime).format('kk:mm')})`]
      }else{
        dateCol = [...dateCol, `(${moment(x.timetable.startTime).format('kk:mm')} - ${moment(x.timetable.breakTime).format('kk:mm')},\n${moment(x.timetable.continueTime).format('kk:mm')} - ${moment(x.timetable.endTime).format('kk:mm')})`]
      }
      if(x.result === 'uncountable'){
        sumCol = [...sumCol,'ขาดงาน/คำนวนเวลาไม่ได้']
      }
    }

    if(x.ot_timetable){
        dateCol = [...dateCol, '('+`${moment(x.ot_timetable.start).format('kk:mm')} - ${moment(x.ot_timetable.end).format('kk:mm')}`+')OT']
    }

    if(x.result === 'working+OT'){
      sumCol = [...sumCol, '   OT:'+minutesToDisplay(x.countableOTTime)]
    }

    return {dateCol, sumCol}
    }

const MonthSelector = (props) => {
    const currentMonthIndex = moment().month();
    const currentYear = moment().year();

    // Generate the past 12 months including the current month
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, 'months');
      months.push({
        label: month.format('MMMM YYYY'),  // Month name and year (e.g., "September 2023")
        value: month.month(),               // Month index
        year: month.year()                  // Year of the month
      });
    }

    // State to hold the currently selected month and year
    const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Handle the month change from the dropdown
    const handleMonthChange = (e) => {
      const selectedOption = months[e.target.value];
      setSelectedMonth(selectedOption.value);
      setSelectedYear(selectedOption.year);
      const selectedMoment = moment({ year: selectedOption.year, month: selectedOption.value });
      props.getTimetableByMonth(selectedMoment.toDate())
    };

    return (
      <div className="month-selector">
        {/* Month Dropdown */}
        <select
          className="month-dropdown"
          value={months.findIndex(month => month.value === selectedMonth && month.year === selectedYear)}
          onChange={handleMonthChange}
          aria-label="Select Month"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
    );
  };




export default Timetable
