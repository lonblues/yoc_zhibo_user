<template>
  <div>
    <div>
      <el-button @click="toPDF">导出PDF</el-button>
    </div>
    <div id="capture" style="width:1200px;height:1700px;overflow:hidden">
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
          <tr>
            <td>获奖作品</td>
            <td>{{ item.work }}</td>
          </tr>
        </table>
      </div>
      <div class="picTable"><img :src="require('../../assets/jea.jpeg')" style="width:350px;height:150px"></div>
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
      title: ''
    }
  },
  created () {
    this.teamList = this.$store.state.teamList
    this.title = this.$store.state.title
    console.log(this.teamList)
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
<style scoped lang="scss">
.title {
  width: 100%;
  text-align: center;
  font-family: "Microsoft YaHei";
  font-size: 160%;
  margin-bottom: 20px;
  margin-top: 100px;
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
.picTable {
  margin-top: 60px;
  margin-left: 230px;
}
</style>
