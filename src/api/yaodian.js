/**
 * Created by huzeyin on 2020/5/12.
 */
import request from '../utils/request'
export function loginByCreater (creater_email, creater_pwd) {
  return request.post('./index.php', {
    function: 'loginByCreater',
    creater_email: creater_email,
    creater_pwd: creater_pwd
  })
}
export function updateAlbum (id, creater_id, name, name_sub, intro, album_tags) {
  return request.post('./index.php', {
    function: 'updateAlbum',
    id,
    creater_id,
    name,
    name_sub,
    intro,
    album_tags
  })
}
export function getMyAlbums (creater_id) {
  return request.post('./index.php', {
    function: 'getMyAlbums',
    creater_id
  })
}
export function getAlbum (id) {
  return request.post('./index.php', {
    function: 'getAlbum',
    id
  })
}
export function updateSong (id, album_id, song_name, song_name_sub, song_lyrics, song_tags) {
  return request.post('./index.php', {
    function: 'updateSong',
    id,
    album_id,
    name: song_name,
    name_sub: song_name_sub,
    lyrics: song_lyrics,
    song_tags
  })
}
export function getSong (id) {
  return request.post('./index.php', {
    function: 'getSong',
    id
  })
}
export function getCreater (creater_id) {
  return request.post('./index.php', {
    function: 'getCreater',
    creater_id
  })
}
export function updateCreater (creater_id, creater_nickName, creater_intro) {
  return request.post('./index.php', {
    function: 'updateCreater',
    creater_id,
    creater_nickName,
    creater_intro
  })
}
export function uploadCreaterAvatar (creater_id, file) {
  const data = new FormData()
  data.append('function', 'uploadCreaterAvatar')
  data.append('creater_id', creater_id)
  data.append('file', file)
  return request.post('./index.php', data)
}
export function uploadAlbumCover (album_id, file) {
  const data = new FormData()
  data.append('function', 'uploadAlbumCover')
  data.append('album_id', album_id)
  data.append('file', file)
  return request.post('./index.php', data)
}

export function submitAlbumReview (album_id, update_note, review_songs, review_stage) {
  return request.post('./index.php', {
    function: 'submitAlbumReview',
    album_id,
    update_note,
    review_songs,
    review_stage
  })
}

export function getMyAlbumReviews (creater_id) {
  return request.post('./index.php', {
    function: 'getMyAlbumReviews',
    creater_id
  })
}

export function cancelAlbumReview (review_id) {
  return request.post('./index.php', {
    function: 'cancelAlbumReview',
    review_id
  })
}
