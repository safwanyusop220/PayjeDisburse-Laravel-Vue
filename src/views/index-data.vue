<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Bank Panel</p>

        <n-data-table ref="dataTableInst" :columns="columns" :data="programs" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable, NButton } from "naive-ui"

const pagination = reactive({
    page: 1,
    pageSize: 6,
    showSizePicker: true,
    simple: false,
    pageSizes: [3, 6, 10],
    onChange: (page) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    }
})

const dataTableInstRef = ref(null)

export default defineComponent({
  components: { NSpace, NDataTable, NButton},
    setup() {
      const programs = ref([])

      const getPrograms = async () => {
            try {
                const url = 'http://127.0.0.1:8000/api/programs'
                const response = await axios.get(url)
                programs.value = response.data.programs
                console.log(programs.value)
            } catch (error) {
                console.error(error)
            }
      }

      getPrograms()

      const columns = [
        //No
        {
          title: "No",
          key: "no",
          width: 50,
          render: (row, recordIndex) => {
            const { page, pageSize } = pagination;
            const currentCount = (page - 1) * pageSize + recordIndex + 1;

            return currentCount;
          },
        },
        //Code
        {
          title: "Program Code",
          key: "code",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Name
        {
          title: "Program Name",
          key: "name",
          resizable: true,
          minWidth: 130,
        },
        //Type
        {
          title: "Program Type",
          key: "type.name",
          resizable: true,
          minWidth: 150,
          filterOptions: [
            {
              label: "Individual",
              value: "1"
            },
            {
              label: "Group",
              value: "2"
            },
            {
              label: "Schedule",
              value: "3"
            },
            {
              label: "Batch",
              value: "4"
            },
          ],
          filter(value, row) {
              return row.type_id === parseInt(value, 10);
          }
        },
        //Disburse Amount
        {
          title: "Disburse Amount",
          key: "disburse_amount",
          resizable: true,
          minWidth: 170,
          sorter: (row1, row2) => row1.disburse_amount - row2.disburse_amount

        },
        //Status
        {
          title: "Status",
          key: "status.name",
          resizable: true,
          minWidth: 130,
          filterOptions: [
            {
              label: "Submitted",
              value: "1"
            },
            {
              label: "Recommended",
              value: "2"
            },
            {
              label: "Approved",
              value: "3"
            },
            {
              label: "Rejected",
              value: "4"
            },
          ],
          filter(value, row) {
              return row.status_id === parseInt(value, 10);
          }
        },
        //Action
        {
          title: "Action",
          key: "id",	 
          align: "center",
          width: 160, // Adjust the width based on your requirements
          render(row) {
            return h(
              "div",
              { class: "space-x-1" },
              [
              h(
                  NButton,
                  {
                    size: "tiny",
                    type: "info",
                    onClick: () => view(row.id)
                  },
                  "View"
                ),
                h(
                  RouterLink ,
                  {
                    to: {
                      name: 'Edit', // replace with the name of your edit route
                      params: { id: row.id } // replace 'id' with the parameter your edit route expects
                    }
                  },
                  [
                    h(
                      NButton,
                      {
                        size: "tiny",
                        type: "warning"
                      },
                      "Edit"
                    )
                  ]
                ),
                h(
                  NButton,
                  {
                    size: "tiny",
                    type: "error",
                    onClick: () => destroy(row.id)
                  },
                  "Delete"
                )
              ]
            );
          }
        }
        ];
      return {
        dataTableInst: dataTableInstRef,
        columns,
        programs,
        pagination
      }
    },
    
})
</script>

<style scoped>
:deep(.slide-left-enter-active),
:deep(.slide-left-leave-active) {
  transition: transform 2s ease, opacity 2s ease;
}

:deep(.slide-left-enter-from),
:deep(.slide-left-leave-to) {
  position: absolute;
  opacity: 0;
}

:deep(.slide-left-enter-from) {
  transform: translateX(-10px);
}

:deep(.slide-left-leave-to) {
  transform: translateX(10px);
}
</style>