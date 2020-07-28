import Cookies from 'js-cookie'

const USER_ID = 'user_id'
const USER_NAME = 'user_name'

export function setUserId (user_id) {
  Cookies.set(USER_ID, user_id)
}
export function getUserId () {
  return Cookies.get(USER_ID)
}
export function removeUserId () {
  Cookies.remove(USER_ID)
}
export function setUserName (user_name) {
  Cookies.set(USER_NAME, user_name)
}
export function getUserName () {
  return Cookies.get(USER_NAME)
}
export function removeUserName () {
  Cookies.remove(USER_NAME)
}
