<template>
    <div >
        <div><el-button @click="toPDF" type="primary">导出PDF</el-button></div>
        <div id="capture" style="width:1200px;">
          <!-- <div v-for="(item,index) in awardInfo" :key="index" >
            <div class="pic">
                <img :src="require('../../assets/fbla.png')" style="width:240px;height:240px;margin-left:60px">
            </div>
            <div class="title">
                {{item.project.project_name}}喜报
            </div>
            <div class="advertising">
                Advertising
            </div>
            <div class="testAward">{{item.test_award}}</div>
            <div class="name" style="margin-top:100px" v-if="item.student_info">{{item.student_info.student_lastName+awardInfo.student_info.student_givenName}}</div>
            <div class="name" style="margin-top:40px" v-if="item.student_info">{{item.student_info.student_givenName_pinyin+' '+awardInfo.student_info.student_lastName_pinyin}}</div>
            <div class="school" style="margin-top:100px" v-if="item.account">{{item.account.account_name}}</div>
            <div class="school" style="margin-top:40px" v-if="item.account">{{item.account.account_nameEN}}</div>

          </div> -->

        </div>

    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  data () {
    return {
      awardInfo: [
        {
          test_subject: '',
          test_score: '',
          test_award: '',
          china_final_status: '',
          award_type: '',
          student_info: {},
          app_info: {},
          account: {},
          project: {}
        }
      ]
    }
  },
  created () {
    this.awardInfo = this.$store.state.awardInfo
    console.log(111)
    console.log(this.awardInfo)
  },
  methods: {
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
.pic{
    width: 100%;
    height: 240px;
    margin-top:60px;
}
.title{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 260%;
    margin-top: 60px;
}
.advertising{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 260%;
    margin-top: 200px;
    font-weight: bold;
}
.testAward{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 300%;
    margin-top: 140px;
    font-weight: bold;
}
.name{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 240%;

}
.school{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 200%;
}
</style>
