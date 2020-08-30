<template>
  <div>
    <el-button @click="toPDF" type="primary" class="mb20 mt20">导出喜报</el-button>
    <table-list :tableHead="award.tHead" :tableData="award.tBody" :isPaginationShow="false">
    </table-list>
    <!-- <el-dialog title="导出" :visible.sync="dialogVisible" width="30%">
      <div>
        个人布局：
        <el-radio v-model="radio" label="1">单页</el-radio>
        <el-radio v-model="radio" label="2">表格</el-radio>
      </div>
      <div style="margin-top:20px">
        团队布局：
        <el-radio v-model="radio1" label="1">单页</el-radio>
        <el-radio v-model="radio1" label="2">表格</el-radio>
      </div>
      <div style="margin-top:20px">
        顺序：
        <el-radio v-model="radio2" label="1">个人奖项在前</el-radio>
        <el-radio v-model="radio2" label="2">团队奖项在前</el-radio>
      </div>
      <div style="margin-top:20px">
        奖项：
        <el-checkbox-group v-model="chooseAward" style="display:inline">
          <el-checkbox v-for="(item,index) in chooseAwards" :key="index" :label="item"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="margin-top:20px">
        奖项顺序
        <div v-for="(item,index) in chooseAward" :key="index" style="display:flex;align-items:center;margin-top:20px">
          <div>{{item}}</div>
          <el-button size="mini" style="margin-left:20px" type="text" @click="moveUp(index)">上移</el-button>
          <el-button size="mini" type="text" @click="moveDown(index)">下移</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="toPDF">确定</el-button>
      </span>
    </el-dialog> -->


  </div>
</template>

<script>
import tableList from '@/components/Table'
import { getAwardsByAccountProject } from '@/api/yaodian.js'
export default {
  name: 'award',
  components: {
    tableList
  },
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      chooseIndex: 0,
      awardList: [],
      award: {
        tHead: [
          { id: 'student_name', label: '名字' },
          { id: 'group', label: '组' },
          { id: 'student_gender', label: '性别' },
          { id: 'student_mobile', label: '手机号码' },
          { id: 'student_email', label: '邮箱' },
          { id: 'awardName', label: '奖项类型' },
          { id: 'test_award', label: '奖' }
        ],
        tBody: []
      },
      groups: {},

      chooseAwards: [],
      chooseAwardsList: [],
      status: '',
      type: '',
      radio: '1',
      radio1: '1',
      radio2: '1',
      awards: [],
      chooseAward: []
    }
  },
  async created () {
    await this.getAwardsByAccountProject()
    await this.addGroup()
  },
  methods: {
    getAwardsByAccountProject () {
      return getAwardsByAccountProject(
        this.$route.params.id,
        this.$route.params.code
      ).then(({ data }) => {
        this.awardList = data.data
        if (!data.data.length) {
          return
        }
        const awardList = data.data
        console.log(awardList)
        // if ('choose_template' in awardList[0].project) {
        //   this.radio = awardList[0].project.choose_template.individualType || '1'
        //   this.radio1 = awardList[0].project.choose_template.teamType || '1'
        //   this.radio2 = awardList[0].project.choose_template.awardForward || '1'
        //   if ('chooseAwards' in awardList[0].project.choose_template) {
        //     this.chooseAwards =
        //       awardList[0].project.choose_template.chooseAwards
        //     this.chooseAward = this.chooseAwards
        //   }
        // }

        var hash = []
        for (var i = 0; i < awardList.length; i++) {
          if (hash.indexOf(awardList[i].test_award) === -1) {
            if (awardList[i].test_award !== '') {
              hash.push(awardList[i].test_award)
            }
          }
        }
        this.chooseAwardsList = hash

        this.award.tBody = data.data.map(item => {
          return {
            ...item.student_info,
            ...item,
            ...item.app_info
          }
        })
        this.award.tBody = this.award.tBody.map(item => {
          return {
            ...item,
            student_name: `${item.student_lastName}${item.student_givenName}`,
            awardName: item.award_type === 'team' ? '团队奖项' : '个人奖项',
            group: item.application_team_code
          }
        })
        
      })
      
    },
    unique () {
      const isGroups = this.award.tBody.map(item => {
        return item.application_team_code
      })
      return Array.from(new Set(isGroups))
    },
    addGroup () {
      const arr = this.unique()
      arr.forEach((item, index) => {
        this.$set(this.groups, item, [])
      })
      this.award.tBody.forEach(item => {
        if (item.application_team_role !== '领队') {
          this.groups[item.application_team_code].push(item.student_name.trim())
        }
      })
      arr.forEach((item, index) => {
        // 排序
        this.groups[item].sort((x, y) => {
          const reg = /[a-zA-Z0-9]/
          if (reg.test(x) || reg.test(y)) {
            if (x > y) {
              return 1
            } else if (x < y) {
              return -1
            } else {
              return 0
            }
          } else {
            return x.localeCompare(y)
          }
        })
      })
      this.award.tBody.forEach(item => {
        if (item.application_team_role === '领队') {
          this.groups[item.application_team_code].unshift(
            `${item.student_name}(领队)`
          )
        }
      })
      arr.forEach((item, index) => {
        this.groups[item] = Array.from(new Set(this.groups[item]))
      })
      this.award.tBody = this.award.tBody.map(item => {
        return {
          ...item,
          group: this.groups[item.application_team_code].join(' ')
        }
      })
    },
    exportInit () {
      this.dialogVisible = true
    },
    // 获取团队列表
    getTeamList () {
      const awardListBefore = []
      const awardList = []
      for (let i = 0; i < this.award.tBody.length; i++) {
        if (this.award.tBody[i].award_type === 'team') {
          awardListBefore.push(this.award.tBody[i])
        }
      }
      console.log(111,awardListBefore)
      for(let i = 0 ; i< this.award.tBody[0].project.choose_template.chooseAwards.length;i++){
        for (let j=0;j<awardListBefore.length;j++){
          if(this.award.tBody[0].project.choose_template.chooseAwards[i]===awardListBefore[j].test_award){
            awardList.push(awardListBefore[j])
          }
        }
      }
      const teamList = []
      let arr = []
      const different = ['Outstanding Team Leader']

      awardList.forEach(item => {
        if (
          !teamList.includes(item.group) ||
          !different.includes(item.test_award)
        ) {
          teamList.push(item.group)
          different.push(item.test_award)
          arr.push(item)
        }
      })
      arr = arr.map(item => {
        let group = item.group.split(' ')
        if (group[0] === '') {
          group.splice(0, 1)
        }
        group = group.join(' ')
        if (group.indexOf('(领队)') !== -1) {
          group = group.split(' ')
          group.splice(1, 0, '<br/>')
        } else {
          group = group.split(' ')
        }
        group = group.join(' ')
        return {
          award: item.test_award,
          team: item.account.account_name,
          groups: group,
          work: item.test_subject
        }
      })
      return arr
    },
    toPDF () {
      // if (this.radio === '1' && this.radio1 === '1') {
      //   const awardList = []
      //   for (let i = 0; i < this.awardList.length; i++) {
      //     if (this.awardList[i].award_type !== 'team') {
      //       awardList.push(this.awardList[i])
      //     }
      //   }
      //   const chooseAwards = this.chooseAwards
      //   const showList = []
      //   for (let i = 0; i < awardList.length; i++) {
      //     for (let j = 0; j < chooseAwards.length; j++) {
      //       if (awardList[i].test_award === chooseAwards[j]) {
      //         awardList[i].showIndex = j
      //         showList.push(awardList[i])
      //       }
      //     }
      //   }
      //   console.log(showList)
      //   showList.sort(this.sortData)
      //   console.log(showList)
      //   if (this.chooseAward.length) {
      //     this.$store.commit('setAward', showList)
      //   } else {
      //     this.$store.commit('setAward', this.awardList)
      //   }
      //   this.$router.push({
      //     name: 'toPDF'
      //   })
      // } else if (this.radio === '2' && this.radio1 === '2') {
      //   const awardList = []
      //   for (let i = 0; i < this.awardList.length; i++) {
      //     if (this.awardList[i].award_type === 'team') {
      //       awardList.push(this.awardList[i])
      //     }
      //   }
      //   if (awardList.length === 0) {
      //     this.$message({
      //       message: '当前页没有团队奖项'
      //     })
      //   } else {
      //     const data = this.getTeamList()
      //     this.$store.commit('getTeamList', data)
      //     this.$store.commit('setAward', this.awardList)
      //     this.$router.push({
      //       name: 'teamPDF'
      //     })
      //   }
      // } else if (this.radio === '1' && this.radio1 === '2') {
      //   const awardList = []
      //   for (let i = 0; i < this.awardList.length; i++) {
      //     if (this.awardList[i].award_type !== 'team') {
      //       awardList.push(this.awardList[i])
      //     }
      //   }
      //   const chooseAwards = this.chooseAwards
      //   const showList = []
      //   for (let i = 0; i < awardList.length; i++) {
      //     for (let j = 0; j < chooseAwards.length; j++) {
      //       if (awardList[i].test_award === chooseAwards[j]) {
      //         awardList[i].showIndex = j
      //         showList.push(awardList[i])
      //       }
      //     }
      //   }
      //   console.log(showList)
      //   showList.sort(this.sortData)
      //   console.log(showList)
      //   if (this.chooseAward.length) {
      //     this.$store.commit('setAward', showList)
      //   } else {
      //     this.$store.commit('setAward', this.awardList)
      //   }
      //   this.$router.push({
      //     name: 'individualTable'
      //   })
      // } else {
      //   this.$message({
      //     message: '团队单页模板尚未导入'
      //   })
      // }
      if(this.awardList[0] && this.awardList[0].project.choose_template){
        
        
          let awardList = this.awardList

          let chooseAwards = awardList[0].project.choose_template.chooseAwards
          const showList = []
          
          console.log(chooseAwards)
          console.log(awardList)

          for (let i = 0; i < chooseAwards.length; i++) {
            for (let j = 0; j < awardList.length; j++) {
              if (awardList[j].test_award === chooseAwards[i]) {
                showList.push(awardList[j])
              }
            }
          }
          console.log(showList)
 
          this.$store.commit('setAward', showList)



          //team部分单独设置
         
          let data = this.getTeamList()
          this.$store.commit('getTeamList', data)

          if(this.awardList[0].project.choose_template.awardForward === '1'){
            this.$router.push({
              path:'/mix'
            })
          }else if(this.awardList[0].project.choose_template.awardForward === '2'){
            this.$router.push({
              path:'/mixX'
            })
          }
        
      }else{
        this.$message({
          message:'请先在首页设置导出模板'
        })
      }

      
    },
    sortData (a, b) {
      return a.showIndex - b.showIndex
    },

    preview () {
      if (this.type === 'table') {
        this.$router.push({
          path: '/individualTable'
        })
      } else {
        this.$router.push({
          path: '/topdf'
        })
      }
    },
    moveDown (index) {
      if (index !== this.chooseAwards.length - 1) {
        const awardList = this.chooseAwards
        awardList[index] = awardList.splice(index + 1, 1, awardList[index])[0]
        this.chooseAwards = awardList
      }
    },
    moveUp (index) {
      if (index !== 0) {
        const awardList = this.chooseAwards
        awardList[index] = awardList.splice(index - 1, 1, awardList[index])[0]
        this.chooseAwards = awardList
      }
    }
  }
}
</script>

<style scoped lang="scss">
.mt20 {
  margin-top: 20px;
  margin-left: 20px;
}
.mb20 {
  margin-bottom: 20px;
}
</style>
