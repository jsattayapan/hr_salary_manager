import React, { useEffect, useState } from 'react'
import { getWarningById,ipAddress, updateWarningApprove } from '../../tunnel'
import moment from 'moment'
import Swal from "sweetalert2";


const Warning = props => {
  const [warningList, setWarningList] = useState('')

useEffect(() => {
  getWarningList()
}, [])

const getWarningList = () => {
  getWarningById({employeeId: props.employeeInfo.id}, res => {
    if(res.status){
      console.log(res);
      setWarningList(res.warningList)
    }else{
      console.log(res);
    }
  })
}

const updateWarningApproveOnClick = (e, id) => {
  let imageFile = e.target.files[0]
  updateWarningApprove({imageFile, id}, res => {
    if(res.status){
      Swal.fire("สำเร็จ!", "ทำการบันทึกเรียบร้อยแล้ว", "success");
      getWarningList()
    } else {
      Swal.fire("ผิดพลาด!", res.msg || "ไม่สามารถบันทึกได้", "error");
    }
  })
}

  return (
    <div className="row">
      <div className='col-12'>
          <table className='table table-striped text-start'>
              <thead>
                  <tr>
                      <th className="text-center" style={{width: '15%'}}>ความรุนแรง</th>
                      <th style={{width: '45%'}}>หมายเหตุ</th>
                      <th style={{width: '20%'}}>พนักงานรับทราบ</th>
                      <th style={{width: '20%'}}>วันที่บันทึก</th>
                  </tr>
              </thead>
              <tbody>
                  {warningList.length !== 0 ?
                  warningList.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map(warning =>
                    <tr>
                    <th  className="text-center">{warning.level}</th>
                    <td>{warning.remark}</td>
                      <td>{warning.accepted === null ? <label name={warning.id} for={warning.id} className="btn btn-info" >บันทึกรับทราบ</label> : <button className="btn btn-link" ><a href={ipAddress +'/public/warning-approve/'+ warning.accepted} target="_blank" download>ดูใบบันทึก</a></button>}
                        <input name={warning.id} onChange={(e) => updateWarningApproveOnClick(e, warning.id)} type="file" id={warning.id} style={{display:'none'}} />
                      </td>
                    <td>{moment(warning.timestamp).format('DD/MM/YYYY')}</td>
                  </tr>

                  )   :
                  <tr>
                      <td align='center' colSpan={4}>ไม่มีข้อมูล</td>
                  </tr>
              }
              </tbody>
          </table>
        </div>
    </div>
  )

}

export default Warning
