<template>
  <div>
    <table-list
      :tableHead="award.tHead"
      :tableData="award.tBody"
      :isPaginationShow="false"
    >
      <!-- <template slot="operation">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getWinnerList(scope.row.id, this.$route.params.id)"
            >
              查看学校获奖名单
            </el-button>
          </template>
        </el-table-column>
      </template> -->
    </table-list>
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
      groups: {

      }
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
      const isGroups = this.award.tBody.map((item) => {
        return item.application_team_code
      })
      console.log(isGroups)
      return Array.from(new Set(isGroups))
    },
    addGroup () {
      const arr = this.unique()
      console.log(arr)
      arr.forEach((item, index) => {
        this.$set(this.groups, item, [])
      })
      this.award.tBody.forEach((item) => {
        this.groups[item.application_team_code].push(item.student_name)
      })
      arr.forEach((item, index) => {
        this.groups[item] = Array.from(new Set(this.groups[item]))
      })
      this.award.tBody = this.award.tBody.map((item) => {
        return {
          ...item,
          group: this.groups[item.application_team_code].join(' ')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
