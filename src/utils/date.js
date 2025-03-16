const getDateTimeNow = () => {
  const date = new Date();
  const dateAndTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
  return dateAndTime;
}

const getDateTwoWeeksAgo = () => {
  const date = new Date()
  date.setDate(date.getDate()-14)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${month}-${day} 00:00:00`
}

const getDateTodayToTomorrow = () => {
  const date = new Date()
  const from = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  const tempTo = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
  const to = `${tempTo.getFullYear()}-${tempTo.getMonth()+1}-${tempTo.getDate()}`;

  return [from, to];
}

const getDayEquivalent = (index) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[index];
}

const getMonthEquivalent = (index) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[index];
}

const getWeeklyDateList = (inputDate) => {
  const date = new Date(inputDate)
  const startOfTheWeekDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-date.getDay())  
  const dateList = []

  for(let i = 0; i <= 7; i++) {
    dateList.push(`${startOfTheWeekDate.getFullYear()}-${startOfTheWeekDate.getMonth()+1}-${startOfTheWeekDate.getDate()+i}`)
  }
  return dateList;
}

const getMonthlyDateList = (year) => {
  const currentYear = new Date(year, 1,1)
  const monthlyDateList = [];

  for(let i = 0; i <= 12; i++) {
    const date = new Date(currentYear.getFullYear(), i, 1)
    monthlyDateList.push(`${date.getFullYear()}-${date.getMonth()+1}-1`)
  }

  return monthlyDateList;
}

const getCurrentDateAndHour = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:00:00`
}

const getCurrentDateAndHourOffset = (offset) => {
  const date = new Date();
  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()+(offset))
  return `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()} ${newDate.getHours()}:00:00`
}

const getUTCFormat = (datetime) => {
  const year = datetime.getUTCFullYear();
  const month = datetime.getUTCMonth()+1;
  const day = datetime.getUTCDate();
  const hour = datetime.getUTCHours();
  const minute = datetime.getUTCMinutes();
  const datetimeFormat = `${year}-${month}-${day} ${hour}:${minute}:00`
  return datetimeFormat
}

module.exports = {
  getDayEquivalent,
  getMonthEquivalent,
  getDateTwoWeeksAgo,
  getCurrentDateAndHour,
  getCurrentDateAndHourOffset,
  getUTCFormat,
  getWeeklyDateList,
  getMonthlyDateList,
  getDateTodayToTomorrow,
  getDateTimeNow
};
