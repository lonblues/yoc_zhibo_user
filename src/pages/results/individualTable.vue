<template>
  <div>
    <!-- <div><el-button @click="toPDF" type="primary">导出PDF</el-button></div> -->
    <div>
      <el-button @click="toPicture" type="primary">导出图片</el-button>
    </div>
    <div id="capture" style="width:1000px;overflow:hidden;min-height:1200px;" :style="capture">

      <div class="title1" style="margin-top:300px">{{title}}</div>
      <div class="title1" style="margin-top:20px">获奖名单</div>
      <div class="title1" style="margin-top:10px">Winners list</div>
      <div class="school" v-if="isShowTeam">学校团队奖/ School Team Award</div>
      <div class="txt" style="margin-top:20px">个人奖 / Individual Award</div>
      <div class="intro">（*按照所有分项全国排名依次排序）</div>
      <table class="table" cellspacing="0" border="1" width="800">
        <tr>
          <td>学校 / School</td>
          <td>分项 / Event</td>
          <td>姓名 / Name</td>
          <!-- <td>全国排名 / Rank</td> -->
          <td>奖项 / Award</td>
        </tr>
        <tr v-for="(item,index) in awardInfo" :key="index">
          <td>
            <div>{{item.account.account_name}}</div>
            <div>{{item.account.account_nameEN}}</div>
          </td>
          <td>{{item.test_subject}}</td>
          <td>
            <div>{{item.student_info.student_lastName + item.student_info.student_givenName}}</div>
            <div>{{item.student_info.student_givenName_pinyin + ' ' + item.student_info.student_lastName_pinyin}}</div>
          </td>
          
          <td>{{item.test_award}}</td>

        </tr>
      </table>
      <div class="contact">
        <div>
          <p>{{awardInfo[0] && awardInfo[0].project.project_mail_from_company}}</p>
          <p>{{awardInfo[0] && awardInfo[0].project.project_BU}}中国办公室</p>
          <p>{{time}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  data () {
    return {
      awardInfo: [],
      title: '',
      flag: true,
      capture: {
        backgroundImage: '',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      bgc: {
        Envirothon: 'Envirothon'
      }
    }
  },
  created () {
    this.awardInfo = this.$store.state.awardInfo
    console.log(this.awardInfo)
    const url =
      this.awardInfo[0] && this.awardInfo[0].project.project_award_background
    console.log(url)
    this.capture.backgroundImage = `url(${this.awardInfo[0] &&
      this.awardInfo[0].project.project_award_background})`
    console.log(this.awardInfo)
    this.title = this.$store.state.title
    const date = new Date()
    this.time =
      date.getFullYear() +
      '.' +
      (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth())
  },
  computed: {
    isShowTeam () {
      return this.awardInfo.some(item => {
        return item.award_type === 'team'
      })
    }
  },
  methods: {
    toPicture () {
      html2canvas(document.querySelector('#capture'), {
        dpi: window.devicePixelRatio * 2,
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const href = canvas.toDataURL('image/png', 1.0)
        const a = document.createElement('a') // 创建a标签
        a.download = 'picture' // 设置图片名字
        a.href = href
        a.dispatchEvent(new MouseEvent('click'))
      })
    }
  }
}
</script>

<style>
.picTable {
  width: 100%;
  display: flex;
  margin-top: 20px;
  justify-content: center;
}
.title1 {
  font-size: 180%;
  text-align: center;
  font-weight: bold;
}
.txt {
  font-size: 120%;
  text-align: center;
}
.intro {
  text-align: center;
}
.table {
  margin: 30px auto;
  text-align: center;
  font-size: 18px;
}
.contact {
  width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 60px;
}
.school {
  width: 800px;
  margin: 20px auto;
  text-align: center;
  font-size: 16px;
}
</style>
