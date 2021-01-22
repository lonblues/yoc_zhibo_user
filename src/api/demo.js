/**
 * Created by huzeyin on 2020/5/12.
 */
import request from '../utils/request'

export function listActiveRooms () {
  return request.post('./index.php', {
    function: 'listActiveRooms'
  })
}

export function createRoomToken (room, userId, type) {
  return request.post('./index.php', {
    function: 'createRoomToken',
    room,
    userId,
    type
  })
}

export function listRoomUsers (room) {
  return request.post('./index.php', {
    function: 'listRoomUsers',
    room
  })
}
