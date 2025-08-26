import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import moment from "moment";
import "moment/locale/th";

import {submitEmployeeAccount, getEmployeeAccountById, deleteEmployeeAccount} from './../../tunnel'


const EmpAccount = props => {
  const [accountList, setAccountList] = useState([])
  const [displayMonth, setDisplayMonth] = useState(new Date())


  useEffect(() => {
    getEmployeeAccount(displayMonth)
  }, [])

  const getEmployeeAccount = (month) => {
    getEmployeeAccountById({employeeId: props.employeeInfo.id, month, type: 'manager'}, res => {

      if(res.status){
        setAccountList(res.accountList)
      }
    })
  }

  const handleAdd = async () => {
    // step 1: show 3 large buttons

    // step 2: build month options (MMMM YYYY)
    const months = [];
    for (let i = 0; i < 6; i++) {
      const m = moment().add(i, "months");
      months.push({
        value: m.format("MM/YYYY"),
        label: m.format("MMMM YYYY")
      });
    }

    Swal.fire({
      title: "เลือกประเภท",
      showCancelButton: true,
      showConfirmButton: false,
      html: `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <button id="btn-income" class="swal2-confirm swal2-styled" style="font-size:18px; padding:12px;">เงินได้</button>
          <button id="btn-deduct" class="swal2-deny swal2-styled" style="font-size:18px; padding:12px;">เงินหัก</button>
          <button id="btn-share" class="swal2-cancel swal2-styled" style="font-size:18px; padding:12px;">เงินแบ่งหัก</button>
        </div>
      `,
      didOpen: () => {
        document.getElementById("btn-income").addEventListener("click", () => {
          Swal.close({type: 'เงินได้'});
        });
        document.getElementById("btn-deduct").addEventListener("click", () => {
          Swal.close({type: 'เงินหัก'});
        });
        document.getElementById("btn-share").addEventListener("click", () => {
          Swal.close({type: 'เงินแบ่งหัก'});
        });
      }
    }).then(res => {
      console.log(res);
      if(res.type === "เงินได้" || res.type === "เงินหัก"){
        SwalReceiveMoney({months, type: res.type},recRes => {
          if(recRes.status){
            Swal.fire("สำเร็จ!", "ทำการบันทึกเรียบร้อยแล้ว", "success");
            getEmployeeAccount(displayMonth)
            props.refreshEmployeeList()
          } else {
            Swal.fire("ผิดพลาด!", recRes.msg || "ไม่สามารถบันทึกได้", "error");
          }
        })
      }

      if(res.type === "เงินแบ่งหัก"){
        SwalShareMoney({months, type: res.type},recRes => {
          if(recRes.status){
            Swal.fire("สำเร็จ!", "ทำการบันทึกเรียบร้อยแล้ว", "success");
            getEmployeeAccount(displayMonth)
            props.refreshEmployeeList()
          } else {
            Swal.fire("ผิดพลาด!", recRes.msg || "ไม่สามารถบันทึกได้", "error");
          }
        })
      }
    })
  };

  const SwalReceiveMoney = async ({months, type}, callback) => {
    const { value: formValues } = await Swal.fire({
      title: `${type}`,
      html: `
        <select id="swal-month" class="swal2-input">
          ${months.map(m => `<option value="${m.value}">${m.label}</option>`).join("")}
        </select>
        <input id="swal-amount" class="swal2-input" type="number" placeholder="จำนวนเงิน" />
        <input id="swal-note" class="swal2-input" type="text" placeholder="หมายเหตุ" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const month = document.getElementById("swal-month").value;
        const amount = document.getElementById("swal-amount").value;
        const note = document.getElementById("swal-note").value;
        if (!amount) {
          Swal.showValidationMessage("กรุณากรอกจำนวนเงิน");
          return;
        }
        if (!note) {
          Swal.showValidationMessage("กรุณาใส่หมายเหตุ");
          return;
        }
        if (amount <= 0) {
          Swal.showValidationMessage("กรุณาใส่จำนวนเงินที่มากกว่า 0");
          return;
        }
        return { type, month, amount, note };
      }
    });

    if (formValues) {
      let {amount, amountPerMonth, note, month, type} = formValues
      submitEmployeeAccount({
        amount,
        amountPerMonth,
        remark: note,
        type,
        employeeId: props.employeeInfo.id,
        month: moment(month, 'MM/YYYY').toDate(),
        username: props.user.username
      }, res => callback(res))
    }
  }

  const SwalShareMoney = async ({months, type}, callback) => {
    const { value: formValues } = await Swal.fire({
      title: `${type}`,
      html: `
      <h5>เริ่มรอบเดือน</h5>
        <select id="swal-month" class="swal2-input">
          ${months.map(m => `<option value="${m.value}">${m.label}</option>`).join("")}
        </select>
        <input id="swal-amountPerMonth" class="swal2-input" type="number" placeholder="จำนวนเงินหักต่อเดือน" />
        <input id="swal-amount" class="swal2-input" type="number" placeholder="จำนวนเงินเต็ม" />
        <input id="swal-note" class="swal2-input" type="text" placeholder="หมายเหตุ" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const month = document.getElementById("swal-month").value;
        const amountPerMonth = document.getElementById("swal-amountPerMonth").value;
        const amount = document.getElementById("swal-amount").value;
        const note = document.getElementById("swal-note").value;
        console.log('amountPerMonth: ', amountPerMonth);
        console.log('amount: ', amount);
        console.log(parseInt(amount) <= parseInt(amountPerMonth));
        if (!amount) {
          Swal.showValidationMessage("กรุณากรอกจำนวนเงิน");
          return;
        }
        if (!amountPerMonth) {
          Swal.showValidationMessage("กรุณากรอกจำนวนเงิน");
          return;
        }
        if (amount <= 0 || amountPerMonth <= 0) {
          Swal.showValidationMessage("กรุณาใส่จำนวนเงินที่มากกว่า 0");
          return;
        }
        if (parseInt(amount) <= parseInt(amountPerMonth)) {
          Swal.showValidationMessage("ยอดเต็มไม่สามารถน้อยกว่ายอดแบ่งจ่าย");
          return;
        }
        if (!note) {
          Swal.showValidationMessage("กรุณาใส่หมายเหตุ");
          return;
        }
        return { type, month, amount, note, amountPerMonth };
      }
    });

    if (formValues) {
      let {amount, amountPerMonth, note, month, type} = formValues
      submitEmployeeAccount({
        amount,
        amountPerMonth,
        remark: note,
        type,
        employeeId: props.employeeInfo.id,
        month: moment(month, 'MM/YYYY').toDate(),
        username: props.user.username
      }, res => callback(res))
    }
  }

  const deleteEmployeeAccountOnClick = (accountDetail) => {
    Swal.fire({
      title: `ต้องการลบ ${accountDetail.remark}`,
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteEmployeeAccount({
          employeeId:props.employeeInfo.id,
          remark: accountDetail.remark,
          timestamp: accountDetail.timestamp,
          amount: accountDetail.amount,
          type: accountDetail.type,
          month: accountDetail.month
        }, res => {
          if(res.status){
            Swal.fire('ข้อมูลถูกลบแล้ว', '', 'success')
            getEmployeeAccount(displayMonth)
            props.refreshEmployeeList()
          }else{
            Swal.fire(res.msg, '', 'error')
          }
        })
      }
    })
  }

  return (
    <div className="row  text-end">
    <div className="col-12">
      <button className="btn btn-primary" onClick={handleAdd}>
        + รายการ
      </button>
    </div>

        <div className="col-12 my-2">
          <div className="float-end" style={{width: '300px'}}>
            <input
              value={displayMonth.toISOString().slice(0, 7)}
              onChange={e => {
                const [year, month] = e.target.value.split("-");
                // สร้าง Date ใหม่ (set เป็นวันแรกของเดือนนั้น)
                const newDate = new Date(year, month - 1,10);
                getEmployeeAccount(newDate)
                setDisplayMonth(newDate)}}
              type="month"
              className="form-control"
            />
          </div>
          </div>
          <div className="col-12 my-2">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th style={{width: '10%'}}>วันที่</th>
                  <th className="text-start" style={{width: '40%'}}>รายการ</th>
                  <th style={{width: '10%'}}>จำนวนเงิน</th>
                  <th style={{width: '10%'}}>ประเภท</th>
                  <th style={{width: '10%'}}>รอบเดือน</th>
                  <th style={{width: '20%'}}>บันทึกโดย</th>
                </tr>
              </thead>
              <tbody>
                {
                  accountList.length !== 0 ?
                  accountList.sort((x,y) => moment(y.timestamp) - moment(x.timestamp)).map(x => (
                    <tr>
                      <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                      <td className="text-start">{x.remark}</td>
                      <td>{x.amount.toLocaleString()}</td>
                      <td>{x.type}</td>
                      <td>{moment(x.month).format('MM/YYYY')}</td>
                      <td>{x.createBy} {props.user.username === 'olotem321' && <button style={{marginLeft: '20px'}} className="btn btn-danger " onClick={() => deleteEmployeeAccountOnClick(x)}>ลบ</button>}</td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan="6">ไม่พบข้อมูล</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
    </div>
  );
}

export default EmpAccount
