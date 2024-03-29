<template>
  <div>
    <!-- ======================================= -->
    <!-- == "Base header" ====================== -->
    <!-- ======================================= -->
    <base-header
      type="primary"
      class="pb-6"
    >
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            Dashboard
          </h6>
          <nav
            aria-label="breadcrumb"
            class="d-none d-md-inline-block ml-md-4"
          >
            <route-bread-crumb />
          </nav>
        </div>
      </div>
    </base-header>

    <!-- ======================================= -->
    <!-- == Main container ===================== -->
    <!-- ======================================= -->
    <div class="container-fluid mt--6 card-wrapper">
      <div class="card mb-4">
        <div class="container-fluid mt-4">
          <div class="row">
            <!-- menu -->
            <div class="col-lg-2 mb-4">
              <ul class="list-group cursor-pointer">
                <li
                  :class="active === 1 ? 'bg-primary text-white' : 'bg-white text-primary'"
                  class="list-group-item d-flex justify-content-between align-items-center"
                  @click="active = 1"
                >
                  Non-lues
                  <badge
                    type="primary"
                    pill
                  >
                    {{ notReadNotifications.length || 0 }}
                  </badge>
                </li>
                <li
                  :class="active === 2 ? 'bg-primary text-white' : 'bg-white text-primary'"
                  class="list-group-item d-flex justify-content-between align-items-center"
                  @click="active = 2"
                >
                  Lues
                  <badge
                    type="primary"
                    pill
                  >
                    {{ readNotifications.length || 0 }}
                  </badge>
                </li>
                <li
                  :class="active === 3 ? 'bg-primary text-white' : 'bg-white text-primary'"
                  class="list-group-item d-flex justify-content-between align-items-center"
                  @click="active = 3"
                >
                  Toutes
                  <badge
                    type="primary"
                    pill
                  >
                    {{ allNotifications.length || 0 }}
                  </badge>
                </li>
              </ul>
            </div>

            <!-- content -->
            <div class="col-lg-10">
              <div class="card bg-white shadow">
                <div class="card-header border-0">
                  <div class="row align-items-center">
                    <div class="col">
                      <h3 class="mb-0">
                        Gérez vos notifications
                      </h3>
                    </div>
                    <div class="col text-right">
                      <base-button
                        :disabled="active === 2 || notReadNotifications.length < 1"
                        type="primary"
                        size="sm"
                        @click="readAllNotifications()"
                      >
                        Tout lire
                      </base-button>
                    </div>
                  </div>
                </div>
                <div>
                  <el-table
                    id="notificationsTable"
                    :data="queriedData"
                    row-key="id"
                    class="table-responsive table-light"
                    header-row-class-name="thead-light"
                  >
                    <!-- icon -->
                    <el-table-column
                      width="62px"
                      min-width="62px"
                      class="text-center"
                    >
                      <template #default="{row}">
                        <div class="d-flex justify-content-center">
                          <i
                            :class="`${row.icon} bg-${row.type}`"
                            class="avatar avatar-sm rounded-circle"
                          />
                        </div>
                      </template>
                    </el-table-column>

                    <!-- title -->
                    <el-table-column
                      label="Titre"
                      min-width="120px"
                      class="text-center"
                    >
                      <template #default="{row}">
                        <div class="d-flex">
                          <div class="col-auto text-left pl-1 pr-0">
                            <span v-html="row.title" />
                          </div>
                        </div>
                      </template>
                    </el-table-column>

                    <!-- message -->
                    <el-table-column
                      label="Message"
                      min-width="200px"
                      class="text-center"
                    >
                      <template #default="{row}">
                        <div class="d-flex">
                          <div class="col-auto text-left pl-1 pr-0">
                            <span v-html="row.message" />
                          </div>
                        </div>
                      </template>
                    </el-table-column>

                    <!-- timestamp -->
                    <el-table-column
                      label="Date"
                      width="130px"
                      min-width="130px"
                      class="text-center"
                    >
                      <template #default="{row}">
                        <div class="d-flex">
                          <div class="col-auto text-left pl-1 pr-0">
                            <i class="fas fa-clock mr-1" />
                            {{ getFuzzyTime(row.timestamp) }}
                          </div>
                        </div>
                      </template>
                    </el-table-column>

                    <!-- read/notread -->
                    <el-table-column
                      width="120px"
                      min-width="120px"
                      class="text-center"
                    >
                      <template #default="{row}">
                        <div class="d-flex justify-content-center">
                          <base-switch
                            :value="row.isRead"
                            on-text="Lue"
                            off-text="Lue"
                            @input="toggleRead($event, row._id)"
                          />
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div
                  slot="footer"
                  class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap pt-4 pb-2"
                >
                  <div>
                    <p class="card-category text-sm mt-2 mb-3">
                      Affichage de  {{ from + 1 }} à {{ to }} d'un total de {{ total }} entrées
                    </p>
                  </div>
                  <base-pagination
                    v-model="pagination.currentPage"
                    :per-page="pagination.perPage"
                    :total="total"
                    class="pagination-no-border"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BasePagination } from '@/components'
import { ElTable, ElTableColumn, ElOption } from 'element-plus'
import clientPaginationMixin from '@/mixins/clientPaginationMixin'
import dateUtilMixin from '@/mixins/dateUtilMixin'

export default {
  name: 'Settings',
  components: {
    BasePagination,
    [ElOption.name]: ElOption,
    [ElTable.name]: ElTable,
    [ElTableColumn.name]: ElTableColumn
  },
  mixins: [clientPaginationMixin, dateUtilMixin],
  data () {
    return {
      active: 1,
      tableColumns: [
        {
          prop: 'title',
          label: 'Titre',
          minWidth: 120,
          sortable: false
        },
        {
          prop: 'message',
          label: 'Message',
          minWidth: 220,
          sortable: false
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters({
      allNotifications: 'notifications/all',
      notReadNotifications: 'notifications/notRead',
      readNotifications: 'notifications/read'
    })
  },
  watch: {
    active: function (newActive) {
      switch (newActive) {
        case 1: this.tableData = this.notReadNotifications; break
        case 2: this.tableData = this.readNotifications; break
        case 3: this.tableData = this.allNotifications; break
      }
    }
  },
  mounted () {
    // load default table (besoin du timeout pcq vuex prend tu temps à s'actualiser)
    setTimeout(() => {
      this.tableData = this.notReadNotifications
    }, 100)
  },
  methods: {
    readAllNotifications () {
      this.$store.dispatch('notifications/readAll').then(() => {
        setTimeout(() => {
          this.active = 2
        }, 100)
      })
    },
    toggleRead (element, notifId) {
      // disable the switch and re-enable it after 5 seconds
      element.disabled = true
      setTimeout(() => {
        element.disabled = false
      }, 5000)

      // on marque la notification comme lue
      if (element.checked) {
        this.$store.dispatch('notifications/read', { notifId })
      // on marque la notification comme non-lue
      } else {
        this.$store.dispatch('notifications/unread', { notifId })
      }
    }
  }
}
</script>

<style lang="scss">
  #notificationsTable {
    table tr td:first-child {
      padding-right: 0 !important;
    }
  }
</style>
