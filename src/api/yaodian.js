/**
 * Created by huzeyin on 2020/5/12.
 */
import request from '../utils/request'

export function getProjectsByYear (year) {
  return request.post('./index.php', {
    function: 'getProjectsByYear',
    year
  })
}
export function getAccountsByProject (project_code) {
  return request.post('./index.php', {
    function: 'getAccountsByProject',
    project_code
  })
}
export function getAwardsByAccountProject (account_id, project_code) {
  return request.post('./index.php', {
    function: 'getAwardsByAccountProject',
    account_id,
    project_code
  })
}
