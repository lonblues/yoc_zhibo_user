<template>
  <div>
    <table-list
      :tableHead="account.tHead"
      :tableData="account.tBody"
      :isPaginationShow="false"
    >
      <template slot="operation">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getWinnerList(scope.row.id, $route.params.id)"
            >
              查看学校获奖名单
            </el-button>
          </template>
        </el-table-column>
      </template>
    </table-list>
  </div>
</template>

<script>
import tableList from '@/components/Table'
import { getAccountsByProject } from '@/api/yaodian.js'
export default {
  name: 'account',
  components: {
    tableList
  },
  data () {
    return {
      account: {
        tHead: [
          { id: 'account_name', label: '学校' },
          { id: 'account_application_status', label: '报名状态' }
        ],
        tBody: []
      }
    }
  },
  created () {
    getAccountsByProject(this.$route.params.id).then(({ data }) => {
      const ids = Object.keys(data.data)
      this.account.tBody = Object.values(data.data).map((item, index) => {
        return {
          id: ids[index],
          ...item
        }
      })
    })
  },
  methods: {
    getWinnerList (id, code) {
      this.$router.push({ name: 'award', params: { id: id, code: code } })
    }
  }
}
</script>

<style scoped lang="scss"></style>
