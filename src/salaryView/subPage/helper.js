import moment from 'moment'

export const convertMinutesToWord = (totalMinutes) => {
  // Ensure the input is a non-negative number
  if (typeof totalMinutes !== 'number' || totalMinutes < 0) {
    return "Invalid input. Please provide a positive number of minutes.";
  }

  const minutesInHour = 60;
  const minutesInDay = 10 * minutesInHour;

  // Calculate the number of days
  const days = Math.floor(totalMinutes / minutesInDay);

  // Calculate the remaining minutes after removing the days
  const remainingMinutesAfterDays = totalMinutes % minutesInDay;

  // Calculate the number of hours from the remaining minutes
  const hours = Math.floor(remainingMinutesAfterDays / minutesInHour);

  // Calculate the final remaining minutes
  const minutes = remainingMinutesAfterDays % minutesInHour;

  // Build the output string
  const parts = [];
  if (days > 0) {
    parts.push(`${days} วัน`);
  }
  if (hours > 0 || days > 0) { // Always show hours if there are days, even if 0
    parts.push(`${hours} ชม.`);
  }
  parts.push(`${minutes} นาที`);

  return parts.join(' ');
}

export const  minutesToDisplay = minutes => {
    if(!minutes){
      return '***'
    }else{
      if(parseInt(minutes/60)){
        return  parseInt(minutes/60) + 'h ' + minutes % 60 + 'm'
      } else {
        return minutes % 60 + ' m'
      }

    }
  }


  /**
   * Get all days between 21st of previous month and 20th of current month,
   * excluding a specific weekday (e.g. "Monday").
   *
   * @param {string} dateStr - Input date in DD/MM/YYYY format
   * @param {string} weekday - Weekday name to exclude (case-insensitive, e.g. "Monday")
   * @returns {string[]} - Array of dates (DD/MM/YYYY) excluding the weekday
   */
  export const getDaysExcluding = (dateStr) => {
    const excludeDay =  moment(dateStr, "DD/MM/YYYY").day();
    // Weekday mapping
    if (excludeDay === -1) throw new Error("Invalid weekday");

    // Parse input date
    const [day, month, year] = dateStr.split("/").map(Number);

    // Start = 21st of previous month
    const start = new Date(year, month - 2, 21);

    // End = 20th of current month
    const end = new Date(year, month - 1, 20);

    let result = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== excludeDay) {
        result.push(
          d.toLocaleDateString("en-GB") // returns DD/MM/YYYY
        );
      }
    }
    return result;
  }


  export const getMaxDate = (dates) => {
    return dates
      .map(d => moment(d.date, "DD/MM/YYYY"))
      .reduce((max, curr) => (curr.isAfter(max) ? curr : max))
  }

  export const  convertMinutes = (totalMinutes) => {
  const minutesInHour = 60;
  const hoursInDay = 10;

  const totalHours = Math.floor(totalMinutes / minutesInHour);
  const minutes = totalMinutes % minutesInHour;

  const day = Math.floor(totalHours / hoursInDay);
  const hours = totalHours % hoursInDay;

  return { day, hours, minutes };
}
