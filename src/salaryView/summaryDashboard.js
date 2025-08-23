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
      change: "-2% since last quarter",
      changeType: "down",
      icon: <FiUsers />,
    },
    {
      title: "ชั่วโมงทำงาน",
      value: "4576 hrs",
      change: "+19% since last quarter",
      changeType: "up",
      icon: <FiClock />,
    },
    {
      title: "Payroll Cost",
      value: "$ 29.8M",
      change: "+12% since last quarter",
      changeType: "up",
      icon: <FiDollarSign />,
    },
    {
      title: "Net Salary",
      value: "$ 26.4M",
      change: "+12% since last quarter",
      changeType: "up",
      icon: <FiCreditCard />,
    },
    {
      title: "Deductions",
      value: "$ 3.4M",
      change: "-1% since last quarter",
      changeType: "down",
      icon: <FiMinusCircle />,
    },
    {
      title: "Comp Pay",
      value: "$ 1.6M",
      change: "-5% since last quarter",
      changeType: "down",
      icon: <FiPercent />,
    },
  ];

  return (
    <div className="payroll-dashboard">
    <div style={{display:'flex', flexDirection:"row"}}>
    {data.map((item, index) => {
      const iconClass =
        item.changeType === "up"
          ? "payroll-icon-circle up"
          : "payroll-icon-circle down";

      return (
        <div  style={{flex:'1'}} className="payroll-card" key={index}>
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
