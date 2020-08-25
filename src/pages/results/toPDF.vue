<template>
    <div >
        <div><el-button @click="toPDF" type="primary">导出PDF</el-button></div>
        <div id="capture" style="width:1190.56px;overflow:hidden">
          <div v-for="(item,index) in awardInfo" :key="index" style="width:100%;height:1683.78px;overflow:hidden;position:relative">
            <div style="width:100%;height:100%;position:absolute;z-index:-1">
              <img :src="url" style="width:100%;height:100%">
            </div>
            <div class="title">
                {{item.projectName}}喜报
            </div>
            <div class="advertising">
                Advertising
            </div>
            <div class="testAward" >{{item.test_award}}</div>
            <div class="name" style="margin-top:80px">{{item.name}}</div>
            <div class="name" style="margin-top:40px">{{item.nameEN}}</div>
            <div class="school" style="margin-top:80px">{{item.account_name}}</div>
            <div class="school" style="margin-top:40px">{{item.account_nameEN}}</div>
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
      capture: {
        backgroundImage: '',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      url: ''
    }
  },
  created () {
    const awardInfo = this.$store.state.awardInfo
    // this.capture.backgroundImage = `url(${awardInfo[0].project.project_award_background})`
    this.url = awardInfo[0].project.project_award_background

    console.log(awardInfo)
    awardInfo.map(item => {
      item.projectName = item.project.project_name
      item.name = item.student_info.student_lastName + item.student_info.student_givenName
      item.nameEN = item.student_info.student_givenName_pinyin + ' ' + item.student_info.student_lastName_pinyin
      item.account_name = item.account.account_name
      item.account_nameEN = item.account.account_nameEN
    })
    console.log(awardInfo)
    // for(let i=0;i<this.$store.state.awardInfo.length;i++){
    //   this.awardInfo[i].projectName = this.$store.state.awardInfo[i].project.project_name
    this.awardInfo = awardInfo
    // }
  },
  methods: {
    toPDF () {
      html2canvas(document.querySelector('#capture'), {
        useCORS: true
      }).then(canvas => {
        // var contentWidth = canvas.width
        var contentHeight = canvas.height

        var pageHeight = 841.89

        // 未生成pdf的html页面高度
        var leftHeight = contentHeight
        // 页面偏移
        var position = 0
        // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        var imgWidth = 595.28
        var imgHeight = contentHeight / 2

        var pageData = canvas.toDataURL('image/jpeg', 1.0)

        var pdf = new JsPDF('', 'pt', 'a4')

        // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight * 2) {
          pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight * 2
            position -= 841.89
            // 避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage()
            }
          }
        }

        pdf.save('content.pdf')
      })
    }
  }
}
</script>

<style>

.title{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 240%;
    margin-top: 440px;
}
.advertising{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 270%;
    margin-top: 100px;
    font-weight: bold;

}
.testAward{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 300%;
    font-weight: bold;
    margin-top: 80px;
}
.name{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 220%;

}
.school{
    width: 100%;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 220%;
}
</style>
