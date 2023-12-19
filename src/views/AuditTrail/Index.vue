<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Audit Trail</p>
        <div class="flex justify-between">
            <n-input class="mr-[300px]" placeholder="Search">
              <template #prefix>
                <n-icon :component="MdSearch" />
              </template>
            </n-input>
        </div>
        <n-data-table ref="dataTableInst" :columns="columns" :data="auditTrails" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive } from "vue"
import axios from 'axios'
import { NSpace, NDataTable,  NInput, NIcon } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";

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
    },
    prefix({ itemCount }) {
    const startItem = (pagination.page - 1) * pagination.pageSize + 1;
    const endItem = Math.min(pagination.page * pagination.pageSize, itemCount);
    return `${startItem}-${endItem} of ${itemCount}`;
    },
})

const dataTableInstRef = ref(null)

export default defineComponent({
  components: { NSpace, NDataTable, NInput, NIcon },
    setup() {
      const auditTrails = ref([])
      const showModalRef = ref(false);


      const getAuditTrails = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL +'/api/audit-trail'
                const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                auditTrails.value = response.data.auditTrails.map(panel => {
                  // Convert created_at to a Date object
                  const createdAtDate = new Date(panel.created_at);
                  const formattedDate = createdAtDate.toISOString().split('T')[0];

                  return {
                    ...panel,
                    createdDate: formattedDate
                  };
                });
                console.log(auditTrails.value)
            } catch (error) {
                console.error(error)
            }
      }

      getAuditTrails()

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
        //Created Date
        {
          title: "Created Date",
          key: "date",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Created Time
        {
          title: "Created Time",
          key: "time",
          resizable: true,
          minWidth: 130,
        },
        //Name
        {
          title: "Name",
          key: "user.name",
          resizable: true,
          minWidth: 130,
        },
        //Activity
        //Status
        {
          title: "Activity",
          key: "activity.name",
          resizable: true,
          minWidth: 130,
          filterOptions: [
            {
              label: "Created",
              value: "1"
            },
            {
              label: "Updated",
              value: "2"
            },
            {
              label: "Deleted",
              value: "3"
            },
            {
              label: "Recommended",
              value: "4"
            },
            {
              label: "Approved",
              value: "5"
            },
            {
              label: "Rejected",
              value: "6"
            },
          ],
          filter(value, row) {
              return row.activity_id === parseInt(value, 10);
          }
        },
        //Models
        {
          title: "Model",
          key: "model",
          resizable: true,
          minWidth: 130,
        }
        ];
      return {
        placement: ref("left"),
        showModal: showModalRef,
        MdSearch,
        Add12Filled,
        dataTableInst: dataTableInstRef,
        columns,
        auditTrails,
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