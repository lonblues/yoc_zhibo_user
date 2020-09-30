<template>
<div>
    <!-- <div><el-button @click="toPDF" type="primary">导出PDF</el-button></div> -->
    <div>
      <el-button @click="toPicture" type="primary">导出图片</el-button>
    </div>
    <div id="capture" style="width:1000px;overflow:hidden;min-height:1200px;">
        <div class="title1" style="margin-top:300px">{{title}}</div>
        <div class="title1" style="margin-top:20px">获奖名单</div>
        <div class="title1" style="margin-top:10px">Winners List</div>

        <div class="team">
            <div class="teamPage" v-if="teamType==='1'">
                <div class="school" v-if="teamListX.length!==0">学校团队奖/ School Team Award</div>
                <div v-for="(item,index) in teamListX" :key="index">
                    <div class="testAward">{{item.award}}</div>
                    <div class="name">{{item.groups}}</div>
                </div>
            </div>
            <div class="teamTable" v-if="teamType==='2'">
                <div class="school" v-if="teamListX.length!==0">学校团队奖/ School Team Award</div>
                <div class="table-pdf" v-for="(item, index) in teamListX" :key="index">
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
                  
                    </table>
                </div>
            </div>
        </div>

        <div class="individual" style="margin-top:20px">
            <div class="individualPage" v-if="individualType==='1'">
                <div class="txt" style="margin-top:20px" v-if="individualList.length!==0">个人奖 / Individual Award</div>
                <div style="margin-top:40px">
                    <div v-for="(item,index) in individualList" :key="index" style="margin-top:20px">
                        <div class="testAward" >{{item.test_award}}</div>
                        <div class="name">{{item.student_info.student_lastName+item.student_info.student_givenName}}</div>
                    </div>
                </div>

            </div>
            <div class="individualTable" v-if="individualType==='2'">
                <div class="txt" style="margin-top:20px" v-if="individualList.length!==0">个人奖 / Individual Award</div>
                <table class="table" cellspacing="0" border="1" width="800">
                    <tr>
                    <td>学校 / School</td>
                    <td>分项 / Event</td>
                    <td>姓名 / Name</td>
                    <td>奖项 / Award</td>
                    </tr>
                    <tr v-for="(item,index) in individualList" :key="index">
                    <td>
                        <div>{{item.account.account_name}}</div>
                        <div>{{item.account.account_nameEN}}</div>
                    </td>
                    <td>{{item.test_subject}}</td>
                    <td>
                        <div>{{item.student_info.student_lastName + item.student_info.student_givenName}}</div>
                        <div>{{item.student_info.student_givenName_pinyin + item.student_info.student_lastName_pinyin}}</div>
                    </td>
                    <td>{{item.test_award}}</td>

                    </tr>
                </table>
            </div>

        </div>

        <div class="contact">
            <div>
            <p>{{awardList[0] && awardList[0].project.project_mail_from_company}}</p>
            <p>{{awardList[0] && awardList[0].project.project_BU}}中国办公室</p>
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
    data(){
        return{
            individualList:[],
            teamList:[],
            teamListX:[],
            individualType:'',
            teamType:'',
            awardList:[]
        }
    },
    created(){

        let awardList = this.$store.state.awardInfo

        this.individualType = awardList[0].project.choose_template.individualType
        this.teamType = awardList[0].project.choose_template.teamType

        this.awardList = awardList
        console.log(awardList)
        let individualList = []
        let teamList = []
        for (let item of awardList){
            if(item.award_type==='individual'){
                individualList.push(item)
            }else if(item.award_type==='team'){
                teamList.push(item)
            }
        }
        this.individualList = individualList
        this.teamList = teamList


        this.teamListX = this.$store.state.teamList
        console.log(111,this.teamListX)

        this.title = this.$store.state.title
        const date = new Date()
        this.time = date.getFullYear() + '.' + (date.getMonth() < 9 ? '0' + (date.getMonth()+1) : date.getMonth()+1)



    },
    methods:{
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
  margin: 40px auto;
  text-align: center;
  font-size: 18px;
}
.testAward{
    width: 100%;
    text-align: center;
    font-size: 130%;
}
.name{
    width: 60%;
    text-align: center;
    margin: 14px auto;
    

}
</style>