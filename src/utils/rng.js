export function createRandomNumber() {
  const date = new Date()
  const random = Math.floor((Math.random() * 10000) + 1).toString()
  const milliseconds = date.getMilliseconds().toString()
  return `${random}${milliseconds}`
}
