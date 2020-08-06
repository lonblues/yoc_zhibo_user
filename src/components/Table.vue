<template>
  <div class="detail-table-component">
    <el-table
      v-loading="loading"
      :element-loading-text="loadingText"
      :data="currentData"
      :header-cell-class-name="'table-header'"
      :span-method="spanMethod"
    >
      <el-table-column
        v-for="(column, index) in tableHead"
        :key="index"
        :label="column.label"
        :align="column.align || 'left'"
        :width="column.width"
        :fixed="column.fixed"
        :show-overflow-tooltip="column.showTooltip"
      >
        <template slot-scope="scope">
          <div>{{ scope.row[column.id] }}</div>
        </template>
      </el-table-column>
      <slot name="operation"></slot>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        v-if="isPaginationShow"
        ref="tablePagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeArr"
        :page-size="pageSize"
        :layout="layout"
        :total="totalItems"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  components: {},
  data () {
    return {
      currentPage: 1,
      currentData: [],
      totalItems: 0,
      pageSize: 5,
      loading: false, // 是否添加表格loading加载动画
      loadingText: '数据加载中' //  loading text
    }
  },
  props: {
    height: {
      // default: "230px"
    },
    tableHead: {
      type: Array,
      default: () => [] // prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    },
    // 表格tbody数据，数组中json对象的键值对应thead中的id
    tableData: {
      type: Array,
      default: () => []
    },
    spanMethod: Function,
    handleSelection: Function,
    isPaginationShow: {
      type: Boolean,
      default: true
    },
    pageSizeArr: {
      type: Array,
      default: () => [5, 10, 50, 100]
    },
    layout: {
      type: String,
      default: () => 'total,sizes,prev,next,jumper'
    }
  },
  created () {
    this.init()
  },
  watch: {
    tableData: 'init'
  },
  methods: {
    init () {
      this.reset()
      if (this.isPaginationShow) {
        this.sliceData(0)
        this.totalItems = this.tableData.length
      } else {
        this.currentData = this.tableData
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.sliceData((this.currentPage - 1) * val)
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    handleOption (type, index, row) {
      this.$emit('handleOptions', type, index, row)
    },
    reset () {
      this.pageSize = 5
      this.currentPage = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
  &::before {
    height: 0;
  }
  /deep/ th {
    background-color: #f5f7fa;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }
  /deep/ td {
    padding: 6px 0;
  }
}
.pagination-wrapper {
  margin-top: 15px;
  text-align: right;
}
</style>
