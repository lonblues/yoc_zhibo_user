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
          { id: 'student_gender', label: '性别' },
          { id: 'student_mobile', label: '手机号码' },
          { id: 'student_email', label: '邮箱' }
        ],
        tBody: []
      }
    }
  },
  created () {
    getAwardsByAccountProject(
      this.$route.params.id,
      this.$route.params.code
    ).then(({ data }) => {
      this.award.tBody = data.data.map(item => {
        return {
          ...item.student_info,
          item
        }
      })
      this.award.tBody = this.award.tBody.map(item => {
        return {
          ...item,
          student_name: `${item.student_lastName}${item.student_givenName}`
        }
      })
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss"></style>
