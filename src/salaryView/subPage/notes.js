import React, {useEffect, useState} from 'react'
import moment from 'moment'
import Swal from 'sweetalert2'
import { submitNoteToEmployee, deleteEmployeeNoteByNoteId, getEmployeeNoteListById } from './../../tunnel'

export const Notes = props => {
  const [noteList, setNoteList] = useState([])


  useEffect(() => {
    getNoteList()
  }, [])

  const getNoteList = () => {
    getEmployeeNoteListById({employeeId: props.employeeInfo.id}, res => {
      if(res.status){
        setNoteList(res.noteList)
      }
    })
  }

    const createNewNoteOnClick = () => {
        Swal.fire({
            title: 'เพิ่ม Note ',
            input: 'textarea',
            inputPlaceholder: 'กรุณาพิมพ์ข้อความในนี้...',
            inputAttributes: {
              'aria-label': 'กรุณาพิมพ์ข้อความในนี้'
            },
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                  return 'กรุณาระบุข้อความที่ต้องการบันทึก!'
                }
              },
          }).then((result) => {
            if (result.isConfirmed) {

              submitNoteToEmployee({
                note: result.value,
                employeeId: props.employeeInfo.id,
                createBy: props.user.username, // this.props.user.username,
                type: 'payroll'
              }, res => {
                if(res.status){
                    Swal.fire(
                        "สำเร็จ!",
                        `ข้อมูลถูกบันทึกแล้ว`,
                        "success"
                      );
                      getNoteList()
                }else{
                    Swal.fire(
                        "เกิดข้อผิดพลาด!",
                        res.msg,
                        "error"
                      );
                }
              })
            }
          });

    }

    const deleteNote = (id, note) => {
        Swal.fire({
            title: 'ต้องการลบโน๊ตนี้?',
            text: note,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEmployeeNoteByNoteId({id}, res => {
                    if(res.status){
                        Swal.fire(
                            'สำเร็จ!',
                            'โน๊ตนี้ได้ถูกลบแล้ว',
                            'success'
                        )
                        getNoteList()
                    }else{
                        Swal.fire(
                            "เกิดข้อผิดพลาด!",
                            res.msg,
                            "error"
                          );
                    }
                })
            }
        });
    }

    return (
        <div className='row'>
             <style>
        {`
          .table .action-btn {
            visibility: hidden;
          }

          .table tr:hover .action-btn {
            visibility: visible;
          }
        `}
      </style>
            <div className='col-12 text-end'>
                <button onClick={createNewNoteOnClick} className='btn btn-primary'>+ โน๊ต</button>
            </div>
            <div className='col-12'>
                <table className='table table-striped text-start'>
                    <thead>
                        <tr>
                            <th></th>
                            <th style={{width: '65%'}}>รายละเอียด</th>
                            <th style={{width: '15%'}}>บันทึกโดย</th>
                            <th style={{width: '15%'}}>วันที่</th>
                        </tr>
                    </thead>
                    <tbody>
                        {noteList.length !== 0 ?
                        noteList.map(note =>
                            <tr>
                                <td><button onClick={() => deleteNote(note.id, note.note)} className='btn btn-sm btn-danger action-btn'>x</button></td>
                                <td style={{width: '65%'}}>{note.note}</td>
                                <td style={{width: '15%'}}>{note.createBy.first_name}</td>
                                <td style={{width: '15%'}}>{moment(note.timestamp).format('DD/MM/YYYY')}</td>
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

export default Notes;
