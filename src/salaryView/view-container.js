import React, {useState} from 'react'
import EmployeeList from './employeeList'
const Container = props => {


  return (
    <div>
      <EmployeeList user={props.user} />
    </div>
  )
}

export default Container
