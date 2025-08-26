
import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import {convertMinutesToWord, minutesToDisplay} from './helper'
import moment from 'moment'
import 'moment/locale/th';
import { getEmployeeTimeScanById, submitEmployeeTimetable, deleteEmployeeTimetable, submitemployeeDayOff} from './../../tunnel'
import { FaEllipsisV, FaCalendarTimes } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";
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


      const handle3DotsClick = (date) => {
        Swal.fire({
          title: "วันที่ "+ date,
          text: 'เลือกประเภท',
          showCancelButton: true,
          showConfirmButton: false,
          html: `
            <div style="display:flex; flex-direction:column; gap:12px;">
              <button id="btn-income" class="swal2-confirm swal2-styled" style="font-size:18px; padding:12px;">ปรับตารางงาน</button>
              <button id="btn-deduct" class="swal2-deny swal2-styled" style="font-size:18px; padding:12px;">ใช้สิทธิ์หยุดงาน</button>
            </div>
          `,
          didOpen: () => {
            document.getElementById("btn-income").addEventListener("click", () => {
              Swal.close({type: 'timetable'});
            });
            document.getElementById("btn-deduct").addEventListener("click", () => {
              Swal.close({type: 'leave'});
            });
          }
        }).then(res => {
          console.log(res);
          console.log(date);
          if(res.type === 'timetable'){
            openSwalEditTimetable(date)
          }
        })
      }

      const openSwalEditTimetable = async (date) => {
        const values = await Swal.fire({
          title: "วันที่ "+ date,
          text: 'ปรับเวลางาน',
          html: `
      <div style="text-align:left">
        <label for="startTime">เริ่มงาน</label>
        <input type="time" id="startTime" class="swal2-input" style="width: 90%" />

        <label for="breakTime">พักงาน</label>
        <input type="time" id="breakTime" class="swal2-input" style="width: 90%" />

        <label for="resumeTime">กลับเข้างาน</label>
        <input type="time" id="resumeTime" class="swal2-input" style="width: 90%" />

        <label for="endTime">เลิกงาน</label>
        <input type="time" id="endTime" class="swal2-input" style="width: 90%" />
      </div>
    `,
          focusConfirm: false,
          showCancelButton: true,
          showDenyButton: true,
   showCancelButton: true,
   confirmButtonText: "บันทึกเวลา",
   denyButtonText: "วันหยุด",
   cancelButtonText: "ยกเลิก",

          preConfirm: () => {
            // ฟังก์ชันแปลงเวลาเป็นนาที
            const toMinutes = (t) => {
              const [h, m] = t.split(":").map(Number);
              return h * 60 + m;
            };

      const startTime = document.getElementById("startTime").value;
      const breakTime = document.getElementById("breakTime").value;
      const resumeTime = document.getElementById("resumeTime").value;
      const endTime = document.getElementById("endTime").value;

      const s = toMinutes(startTime);
      const b = toMinutes(breakTime);
      const r = toMinutes(resumeTime);
      const e = toMinutes(endTime);

      if(!(!startTime && !endTime && !breakTime && !resumeTime)){
        if (!startTime || !endTime) {
          Swal.showValidationMessage("กรุณากรอกเวลาเข้าและออกงาน");
          return false;
        }

        if (breakTime || resumeTime) {
          if (!resumeTime ) {
            Swal.showValidationMessage("กรุณากรอกเวลากลับเข้างาน");
            return false;
          }
          if (!breakTime ) {
            Swal.showValidationMessage("กรุณากรอกเวลาพักงาน");
            return false;
          }
          if (!(s < b && b < r && r < e)) {
            Swal.showValidationMessage("⚠️ เวลาต้องเรียงลำดับ: เริ่มงาน < พักงาน < กลับเข้างาน < เลิกงาน");
            return false;
          }
        }
        if (!(s < e)) {
          Swal.showValidationMessage("⚠️ เวลาต้องเรียงลำดับ: เริ่มงาน < เลิกงาน");
          return false;
        }
      }

      return { startTime, breakTime, resumeTime, endTime };
    }
        });
          const setNewDate = (timeString) => {
            const [hours, minutes] = timeString.split(":").map(Number);
            const now = new Date();
            return new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              hours,
              minutes
            );
          }
          console.log(values);

        if(values.isConfirmed){
          const { startTime, breakTime, resumeTime, endTime , isConfirmed} = values.value
          if(!startTime && !endTime && !breakTime && !resumeTime){
            console.log(date);
            deleteEmployeeTimetable({
              employeeId: props.employeeInfo.id,
              date,
              type: 'payroll'
          }, res => {
            if(res.status){
              getTimetableByMonth(moment(timetableList[timetableList.length - 1].date, 'DD/MM/YYYY').toDate())
            }else{
              Swal.fire(
                  "เกิดข้อผิดพลาด!",
                  res.msg,
                  "error"
                );
            }
          })
        }else{
          submitEmployeeTimetable({
            employeeId: props.employeeInfo.id,
            date,
            startTime: setNewDate(startTime),
            breakTime: breakTime === '' ? breakTime : setNewDate(breakTime),
            continueTime: resumeTime === '' ? resumeTime :setNewDate(resumeTime),
            endTime: setNewDate(endTime),
            nightShift: 0,
            type: 'payroll'
          }, res => {
            if(res.status){
              getTimetableByMonth(moment(timetableList[timetableList.length - 1].date, 'DD/MM/YYYY').toDate())
            }else{
              Swal.fire(
                  "เกิดข้อผิดพลาด!",
                  res.msg,
                  "error"
                );
            }
          })
        }
        }

        if(values.isDenied){
          submitemployeeDayOff({
            employeeId: props.employeeInfo.id,
            dayOff: 'วันหยุดประจำสัปดาห์',
            remark: 'วันหยุดประจำสัปดาห์',
            date
          }, res => {
            if(res.status){
              getTimetableByMonth(moment(timetableList[timetableList.length - 1].date, 'DD/MM/YYYY').toDate())
            }else{
              Swal.fire(
                  "เกิดข้อผิดพลาด!",
                  res.msg,
                  "error"
                );
            }
          })
        }

      }





    let totalMinutes = 0
    let totalOtMintues = 0
    let totalDayOff = 0
    let totalLeave = 0
    let totalDayForFullWork = 0
    for(const time of timetableList) {
      totalOtMintues += time.countableOTTime ? time.countableOTTime : 0
      if(time.result === 'working' || time.result === 'working+OT'){
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
                          <th>ชั่วโมงทำงาน(+OT): {convertMinutesToWord((totalMinutes + totalOtMintues))} / {totalDayForFullWork} วัน</th>
                        <th></th>
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
                                        <td className="text-center">
                                            <button
                                              onClick={() => handle3DotsClick(time.date)}
                                              className="btn btn-sm btn-secondary"
                                            >
                                              <BsThreeDotsVertical size={18} />
                                            </button>
                                          </td>


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
    for (let i = -1; i < 12; i++) {
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
