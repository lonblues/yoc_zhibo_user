<template>
  <div>
      <div><el-button @click="toPDF">导出PDF</el-button></div>
      <div id="capture" style="width:1200px;height:1700px;overflow:scroll;">
          <div class="picTable"><img :src="require('../../assets/fbla.png')" style="width:100px;height:100px"></div>
          <div class="title" style="margin-top:40px">{{title}}</div>
          <div class="title" style="margin-top:40px">获奖名单</div>
          <div class="title" style="margin-top:10px">Winners list</div>
          <div class="txt" style="margin-top:40px">学校团队奖 / School Team Award</div>
          <div class="txt" style="margin-top:40px">个人奖 / Individual Award</div>
          <div class="intro">（*按照所有分项全国排名依次排序）</div>
          <table class="table" cellspacing="0"  border="1" width="1000">
              <tr>
                  <td>学校 / School</td>
                  <td>分项 / Event</td>
                  <td>姓名 / Name</td>
                  <td>全国排名 / Rank</td>
                  <td>奖项 / Award</td>

              </tr>
              <tr v-for="(item,index) in awardInfo" :key="index" >
                <td>
                    <div>{{item.account.account_name}}</div>
                    <div>{{item.account.account_nameEN}}</div>
                </td>
                <td>{{item.test_subject}}</td>
                <td>
                    <div>{{item.student_info.student_lastName + item.student_info.student_givenName}}</div>
                    <div>{{item.student_info.student_givenName_pinyin + ' ' + item.student_info.student_lastName_pinyin}}</div>
                </td>
                <td></td>
                <td>{{item.test_award}}</td>

              </tr>
          </table>
          <div class="contact">
            <div>
              <p>{{awardInfo[0].project.project_mail_from_company}}</p>
              <p>{{awardInfo[0].project.project_BU}}中国办公室</p>
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
      flag: true
    }
  },
  created () {
    this.awardInfo = this.$store.state.awardInfo
    console.log(this.awardInfo)
    this.title = this.$store.state.title
    const date = new Date()
    this.time = date.getFullYear() + '.' + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth())
  },
  methods: {
    // moveUp(index){
    //   if(index!==0){
    //     let awardList =this.awardInfo
    //     awardList[index]=awardList.splice(index-1,1,this.awardInfo[index])[0]
    //     this.awardInfo=awardList
    //   }
    // },
    // moveDown(index){
    //   if(index!==this.awardInfo.length-1){
    //     let awardList =this.awardInfo
    //     awardList[index]=awardList.splice(index+1,1,this.awardInfo[index])[0]
    //     this.awardInfo=awardList
    //   }
    // },
    // remove(index){
    //   let awardList = this.awardInfo
    //   awardList.splice(index,1)
    //   this.awardInfo=awardList
    // },

    toPDF () {
      html2canvas(document.querySelector('#capture')).then(canvas => {
        // A4纸的长宽
        var imgWidth = 595.28
        var imgHeight = 841.89

        var pageData = canvas.toDataURL('image/jpeg', 1.0)

        var pdf = new JsPDF('', 'pt', 'a4')

        // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        // 当内容未超过pdf一页显示的范围，无需分页

        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)

        pdf.save('content.pdf')
      })
    }

  }
}
</script>

<style>
.picTable{
    width:100%;
    display: flex;
    margin-top: 20px;
    justify-content: center;
}
.title{
    font-size: 180%;
    text-align: center;
    font-weight: bold;
}
.txt{
    font-size: 120%;
    text-align: center;
}
.intro{
    text-align: center ;
}
.table{
    margin: 20px auto;
    text-align:center;
    font-size: 18px;
}
.contact{
  width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
}

</style>
