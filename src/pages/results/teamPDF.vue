<template>
  <div style="overflow:hidden">

    <el-button @click="toPicture" type="primary">导出图片</el-button>

    <div id="capture" style="width:900px;overflow:hidden;min-height:1000px" :style="capture">
      <div class="title">
        {{ title }}
      </div>
      <div class="title-size">获奖名单</div>
      <div class="table-pdf" v-for="(item, index) in teamList" :key="index">
        <table class="table" cellspacing="0" width="700" border="1">
          <tr>
            <td>奖项</td>
            <td>{{ item.award }}</td>
          </tr>
          <tr>
            <td>团队</td>
            <td>{{ item.team }}</td>
          </tr>
          <tr>
            <td>成员</td>
            <td v-html="item.groups"></td>
          </tr>
          <!-- <tr>
            <td>获奖作品</td>
            <td>{{ item.work }}</td>
          </tr> -->
        </table>
      </div>
      <div class="contact1">
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
      awardInfo: '',
      teamList: [],
      title: '',
      time: '',
      capture: {
        backgroundImage: '',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
    }
  },
  created () {
    this.teamList = this.$store.state.teamList
    this.awardInfo = this.$store.state.awardInfo
    this.capture.backgroundImage = `url(${this.awardInfo[0].project.project_award_background})`
    console.log(this.capture)
    this.title = this.$store.state.title
    console.log(this.teamList)
    const date = new Date()
    this.time = date.getFullYear() + '.' + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth())
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
    },
    toPicture () {
      html2canvas(document.querySelector('#capture'), {
        dpi: window.devicePixelRatio * 2,
        scale: 2,
        useCORS: true
      }).then((canvas) => {
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
<style scoped lang="scss">
.title {
  width: 100%;
  text-align: center;
  font-family: "Microsoft YaHei";
  font-size: 160%;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 230px;
}
.title-size {
  font-size: 140%;
  text-align: center;
  margin-bottom: 20px;
}
.table-pdf {
  margin-bottom: 20px;

  tr > td:first-child {
    width: 150px;
  }
  td {
    text-align: center;
  }
  tr {
    height: 60px;
    line-height: 24px;
  }
}
.table {
  margin: 0 auto;
}
.contact1{
  width: 700px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
}
</style>
