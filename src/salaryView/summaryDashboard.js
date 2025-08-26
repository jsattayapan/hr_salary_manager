import React from "react";
import {
  FiUsers,
  FiClock,
  FiDollarSign,
  FiCreditCard,
  FiMinusCircle,
  FiPercent,
  FiCalendar,
} from "react-icons/fi";

const PayrollDashboard = (props) => {
  const data = [
    {
      title: "จำนวนพนักงาน",
      value: props.noOfEmployee,
      change: "-",
      changeType: "up",
      icon: <FiUsers />,
    },
    {
      title: "ชั่วโมงทำงาน",
      value: props.sumWorkingHour,
      change: "-",
      changeType: "up",
      icon: <FiClock />,
    },
    {
      title: "เงินเดือน",
      value: "฿ " + props.sumEarning.toLocaleString(),
      change: "-",
      changeType: "up",
      icon: <FiDollarSign />,
    },
    {
      title: "ใช้สิทธิ์",
      value: "฿ " + props.sumBenefit.toLocaleString(),
      change: "-",
      changeType: "up",
      icon: <FiDollarSign />,
    },
    {
      title: "ประกันสังคม",
      value: "฿ " + props.sumSocialSecurity.toLocaleString(),
      change: "-",
      changeType: "up",
      icon: <FiCreditCard />,
    },
    {
      title: "เงินได้พนักงาน",
      value: "฿ " + props.sumReceive.toLocaleString(),
      change: "-",
      changeType: "up",
      icon: <FiCreditCard />,
    },
    {
      title: "เงินหักพนักงาน",
      value: "฿ " + props.sumExpense.toLocaleString(),
      change: "-",
      changeType: "down",
      icon: <FiMinusCircle />,
    },
    {
      title: "ยอดจ่ายรวม",
      value: "฿ " + (
        props.sumEarning + props.sumBenefit + props.sumReceive
        - props.sumSocialSecurity - props.sumExpense).toLocaleString(),
      change: "-",
      changeType: "down",
      icon: <FiMinusCircle />,
    },
  ];

  return (
    <div className="payroll-dashboard w-100">
    <div  style={{display:'flex', flexDirection:"row"}}>
    {data.map((item, index) => {
      const iconClass =
        item.changeType === "up"
          ? "payroll-icon-circle up"
          : "payroll-icon-circle down";

      return (
        <div  className="payroll-card mx-1" key={index}>
          <div className={iconClass}>{item.icon}</div>
          <h3 className="payroll-title">{item.title}</h3>
          <p className="payroll-value">{item.value}</p>
          <p className={`payroll-change ${item.changeType}`}>
            {item.change}
          </p>
        </div>
      );
    })}
    </div>

    {/* Payroll Date */}
    <div className="payroll-card payroll-date-card">
      <div className="payroll-icon-circle up big">
        <FiCalendar />
      </div>
      <p className="payroll-title">Payroll Date</p>
      <p className="payroll-value">17/01/2023</p>
      <p className="payroll-subtitle">
        Payroll Run : 28/12/2022 - 10/01/2023
      </p>
      <button className="payroll-btn">Payroll Details</button>
    </div>


    </div>
  );
};

export default PayrollDashboard;
