<template>
    <div>
        <!-- <div>
            <div>
                <span>选择麦克风</span>
                <el-select v-model="audioDevice" style="margin-left:10px">
                    <el-option v-for="(item,index) in audioDevices" :key="index" :label="item.label" :value="item.deviceId"></el-option>
                </el-select>
            </div>
            <div>
                <span>选择摄像头</span>
                <el-select v-model="videoDevice" style="margin-left:10px">
                    <el-option v-for="(item,index) in videoDevices" :key="index" :label="item.label" :value="item.deviceId"></el-option>
                </el-select>
            </div>
        </div> -->
        <div style="margin-top:20px">
            <!-- <el-button type="primary" @click="showInfo=true">生成roomToken</el-button> -->
            <!-- <p>活跃房间列表</p>
            <el-table :data="room_list" border>
                <el-table-column label="房间名">
                    <template slot-scope="scope">
                        {{scope.row}}
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button type="primary" @click="chooseRoom(scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table> -->
            <el-dialog :visible.sync="showInfo" title="Info">
                
                <p>Please enter your name</p><el-input v-model="userId"></el-input>
              
                <div>
                  <el-button type="primary" style="margin-top:20px" @click="joinRoom">Join Room</el-button>
                </div>
            </el-dialog>
            <!-- <el-dialog :visible.sync="showToken">
                <p>userToken：</p>
                <p>{{userToken}}</p>
            </el-dialog> -->

            <!-- <div style="margin-top:50px;margin-bottom:50px">
                <el-select v-model="currentUser" @focus="listRoomUsers">
                    <el-option v-for="(item,index) in userList" :key="index" :value="item.userId" :label="item.userId"></el-option>
                </el-select>
                <el-button @click="changeView" type="primary">选择用户推流</el-button>
                <el-button @click="stopView">停止推流</el-button>
            </div> -->

        </div>

        <!-- <label>请输入 RoomToken 加入房间开始连麦</label>
        <el-input v-model="roomToken" type="text"></el-input> -->
        <el-button type="primary" @click="showInfo=true">Join Room</el-button>
        <el-dropdown trigger="click" @visible-change="listRoomUsers" style="margin-left:10px" placement="bottom-start">
          <el-badge :value="newMessages.length" class="item" :hidden="newMessages.length==0">
            <el-button type="primary">
              Chat<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in userList" :key="index">
              <el-badge :value="computeNum(item.userId)" class="item" :hidden="computeHidden(item.userId)">
                <div style="width:80px;height:50px;line-height:50px" @click="initChat(item.userId)">{{item.userId}}</div>
              </el-badge>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="showSend=true" type="primary" v-if="userId=='admin'" style="margin-left:20px">Post</el-button>

        <el-dialog :visible.sync="showChat" @close="removeMessage">
          <div class="chatBlock">
            <div v-for="(item,index) in chatMessage" :key="index" style="height:50px;line-height:50px;margin-top:10px">
              <div :class="(item.userId==userId?'right':'left')">
                <span style="background:rgba(64,158,255,0.3);border-radius:20px;padding:10px 16px;">{{item.data}}</span>
              </div>
            </div>
          </div>
          <div style="margin-top:20px">
            <el-input v-model="message" style="width:86%"></el-input>
            <el-button type="primary" @click="sendMessage" style="margin-left:10px">Send</el-button>
          </div>
        </el-dialog>

        <div class="users">
            <p style="color:#606266">Local</p>
            <div id="localvideo" style="width:320px"></div>
            <p style="margin-top:30px;color:#606266" v-if="userId=='admin'">Meeting</p>
            <div id="remote">
              <!-- <div id="mobile" style="width:50%"></div>
              <div id="ppt" style="width:50%"></div> -->
            </div>
        </div>
        <el-dialog :visible.sync="showSend" title="Send">
          <el-input v-model="messageAll"></el-input>
          <el-button @click="sendAll">Send</el-button>
        </el-dialog>

    </div>
</template>

<script>
import * as QNRTC from 'pili-rtc-web'
import { listActiveRooms, createRoomToken, listRoomUsers } from '../api/demo'
const myRoom = new QNRTC.StreamModeSession()

console.log('current version is', QNRTC.version)
export default {
  data () {
    return {
      audioDevice: '',
      videoDevice: '',
      audioDevices: [],
      videoDevices: [],
      roomToken: '',
      userList: [],
      currentUser: '',
      lastUser: '',
      showInfo: false,
      showToken: false,
      showSend:false,
      room: '',
      userId: '',
      userToken: '',
      room_list: [],
      type: '',
      currentRoom: '',
      message:'',
      toUserId:'',
      showChat:false,
      chatMessage:[],
      allMessages:{},
      newMessages:[],
      messageAll:''
    }
  },
  mounted () {
    this.listActiveRooms()  
    if (QNRTC.deviceManager.deviceInfo) {
      this.addDeviceToSelect(QNRTC.deviceManager.deviceInfo)
    }
    QNRTC.deviceManager.on('device-update', deviceInfo => {
      this.addDeviceToSelect(deviceInfo)
    })
  },
  methods: {
    addDeviceToSelect (deviceInfo) {
      let audioDevices = []
      let videoDevices = []
      deviceInfo.forEach(info => {
        if (info.kind === 'audioinput') {
          audioDevices.push(info)
        } else if (info.kind === 'videoinput') {
          videoDevices.push(info)
        }
      })
      this.audioDevices = audioDevices
      this.videoDevices = videoDevices
    },
    async joinRoom () {
      // 从输入框中获取 roomToken

      this.showInfo=false

      const roomToken = await this.createRoomToken()

      try {
        // 加入房间
        const users = await myRoom.joinRoomWithToken(roomToken)

        // 如果加入房间后发现房间已经有人发布，就订阅他
        if(this.userId=='admin'){
          for (const user of users) {
            if (user.userId !== myRoom.userId && user.published) {
              // if(user.userId=='mobile'){
              //   this.subscribeUser(user.userId,'mobile')
              // }else if(user.userId=='ppt'){
              //   this.subscribeUser(user.userId,'ppt')
              // }else{
              //   let div = document.createElement('div');
              //   div.setAttribute('id',user.userId);
              //   div.style.width = '320px';
              
              //   let remote = document.getElementById('remote')
              //   remote.appendChild(div)
              //   this.subscribeUser(user.userId,user.userId)
              // }
              let div = document.createElement('div');
              let div1 = document.createElement('div');
              let div2 = document.createElement('div');
              div.appendChild(div1)
              div.appendChild(div2)
              div2.style.height='50px';
              div2.style.color='#606266'
              div2.style.textAlign='center'
              div2.innerHTML=user.userId
              div1.setAttribute('id',user.userId);
              div1.style.width = '320px';
              let remote = document.getElementById('remote')
              remote.appendChild(div)
              

              this.subscribeUser(user.userId,user.userId)
            }
          }
        }
      } catch (e) {
        console.error(e)
        alert(`Join Failed！ErrorCode: ${e.code || ''}`)
        return
      }

      // 监听房间中其他人发布的事件，自动订阅他
      myRoom.on('user-publish', (user) => {
            // if(user.userId=='mobile'){
            //   this.subscribeUser(user.userId,'mobile')
            // }else if(user.userId=='ppt'){
            //   this.subscribeUser(user.userId,'ppt')
            // }else{
            //   let div = document.createElement('div');
            //   div.setAttribute('id',user.userId);
            //   div.style.width = '320px';
            //   let remote = document.getElementById('remote')
            //   remote.appendChild(div)

            //   this.subscribeUser(user.userId,user.userId)
            // }
            if(this.userId=='admin'){
              let div = document.createElement('div');
              let div1 = document.createElement('div');
              let div2 = document.createElement('div');
              div.appendChild(div1)
              div.appendChild(div2)
              div2.style.height='50px';
              div2.innerHTML=user.userId
               div2.style.textAlign='center'
              div2.style.color='#606266'
              div1.setAttribute('id',user.userId);
              div1.style.width = '320px';
              let remote = document.getElementById('remote')
              remote.appendChild(div)
              

              this.subscribeUser(user.userId,user.userId)
            }
       
      })

      myRoom.on("messages-received", data=> {
        
       
        if(this.allMessages[data[0].userId]!==undefined){
          let box = this.allMessages[data[0].userId]
          box.push(data[0])
          this.allMessages[data[0].userId] = box
        }else{
          this.allMessages[data[0].userId]=[]
          let box = this.allMessages[data[0].userId]
          box.push(data[0])
          this.allMessages[data[0].userId] = box

        }
        this.updateMessage()
        if((data[0].userId==this.toUserId) && this.showChat==true){

        }else{
          let box = this.newMessages
          box.push(data[0])
          this.newMessages = box
        }
      })

      myRoom.on("user-join",(user)=>{
        this.$message({
          message:user.userId+'comming~',
          type:'success'
        })
      });

      // 自动发布
      await this.publish(myRoom)

    },
    updateMessage(){
      this.chatMessage = this.allMessages[this.toUserId]
    },

    async publishScreen () {
      let stream
      try {
        // 通过用户在页面上指定的设备发起采集
        // 也可以不指定设备，这样会由浏览器自动选择
        stream = await QNRTC.deviceManager.getLocalStream({
          screen: {
              enabled: true,
              source: "window",
              bitrate: 600,
              height: 1080,
              width: 1920,
          },
          audio: {
              enabled: false,
          }
        })
      } catch (e) {
        console.error(e)
        alert(`Please check your device。ErrorCode: ${e.code}`)
        return
      }

      // 将采集到的流静音播放
      const localVideo = document.getElementById('localvideo')
      stream.play(localVideo, true)

      try {
        // 发布采集流
        await myRoom.publish(stream)
      } catch (e) {
        console.error(e)
        alert(`Fail，ErrorCode: ${e.code}`)
      }
    },
    async publish () {
      let stream
      try {
        // 通过用户在页面上指定的设备发起采集
        // 也可以不指定设备，这样会由浏览器自动选择
        stream = await QNRTC.deviceManager.getLocalStream({
          video: {
            enabled: true,
            deviceId: this.videoDevice,
            bitrate: 1000,
            height:480,
            width:640
          },
          audio: {
            enabled: false,
            deviceId: this.audioDevice
          }
        })
      } catch (e) {
        console.error(e)
        alert(`Please check your device。ErrorCode: ${e.code}`)
        return
      }

      // 将采集到的流静音播放
      const localVideo = document.getElementById('localvideo')
      stream.play(localVideo, true)

      try {
        // 发布采集流
        await myRoom.publish(stream)
      } catch (e) {
        console.error(e)
        alert(`Fail，ErrorCode: ${e.code}`)
      }
    },
    subscribeUser (userId,position) {
      const remoteContainer = document.getElementById(position)
      // 订阅目标用户
      myRoom.subscribe(userId).then(stream => {
        stream.play(remoteContainer)
      })
    },
    listActiveRooms () {
      listActiveRooms().then(res => {
        this.room_list = res.data.rooms
      })
    },
    createRoomToken () {
      return new Promise((resolve,reject)=>{
        this.room = 'test'
        createRoomToken(this.room,this.userId, 'user').then(res => {
          resolve(res.data.data)
        })
      })
      
    },
    listRoomUsers (e) {
      if(e){
        if(this.room!==''){
          listRoomUsers('test').then(res => {
            if(this.userId!=='admin'){
              let list = res.data.users.filter(item=>{
                return item.userId=='admin'
              })
              this.userList = list
            }else{
              let list = res.data.users.filter(item=>{
                return item.userId!=='admin'
              })
              this.userList = list
            }
          })
        }
      }
    },
    changeView () {
      for (let item of this.userList) {
        if (item.userId == this.currentUser) {
          myRoom.setMergeStreamLayout(this.currentUser, {
            x: 0, y: 0, w: 1920, h: 1080, hidden: false, muted: false
          })
        } else {
           myRoom.setMergeStreamLayout(item.userId, {
            x: 0, y: 0, w: 0, h: 0, hidden: false, muted: false
          })
        }
      }
    },
    stopView(){
      myRoom.stopMergeStream();
    },
    initChat(userId){
      this.toUserId = userId
      this.message = ''
      this.showChat = true
      console.log(this.allMessages)
      if(this.allMessages[userId]){
        this.chatMessage=this.allMessages[userId]
      }else{
        this.chatMessage = []
      }
      let box = this.newMessages.filter(item=>{
        return item.userId!==this.toUserId
      })
      this.newMessages=box
    },
    sendMessage(){
      myRoom.sendCustomMessage(this.message,[this.toUserId]);
      let data={
        data:this.message,
        type:'normal',
        userId:this.userId
      }
       if(this.allMessages[this.toUserId]){
         let box = this.allMessages[this.toUserId]
          box.push(data)
          this.allMessages[this.toUserId] = box
        }else{
          this.allMessages[this.toUserId]=[]
          let box = this.allMessages[this.toUserId]
          box.push(data)
          this.allMessages[this.toUserId] = box
        }
        this.updateMessage()
    },
    removeMessage(){
      this.chatMessage=[]
    },
    computeNum(userId){
      let array = []
      array = this.newMessages.filter(item=>{
        return item.userId==userId
      })
      return array.length
    },
    computeHidden(userId){
      let array = []
      array = this.newMessages.filter(item=>{
        return item.userId==userId
      })
      if(array.length==0){
        return true
      }else{
        return false
      }
    },
    sendAll(){
      myRoom.sendCustomMessage(this.messageAll);
      this.showSend=false
    }
  }
}
</script>

<style>
select {
  width: 300px;
}

section {
  margin-bottom: 20px;
}

.qnrtc-stream-player {
  width: 100% !important;
  /* height: 1080px !important; */
  background: #000;
}
#remote{
  display: flex;
  flex-wrap: wrap;
}
.chatBlock{
  width: 100%;
  height: 400px;
  overflow-y: scroll;
}
.right{
  text-align: right;
}
.left{
  text-align: left;
}
</style>
