<template>
	<CardCodeExample ref="card">
      
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Payment</p>
        <n-tabs type="segment" animated>
          <n-tab-pane name="Request" tab="Request">
            <n-data-table ref="paymentRequestTable" :columns="paymentRequestColumns" :data="paymentRequest" :pagination="pagination" />
          </n-tab-pane>
          <n-tab-pane name="Processing" tab="Processing">
            <n-data-table ref="paymentProcessingTable" :columns="paymentProcessingColumns" :data="paymentProcessing" :pagination="pagination" />
          </n-tab-pane>
          <n-tab-pane name="Proceed" tab="Proceed">
            <n-data-table ref="paymentProceedTable" :columns="paymentProceedColumns" :data="paymentProceed" :pagination="pagination" />
          </n-tab-pane>
        </n-tabs>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable, NTabs, NTabPane } from "naive-ui"
import { format } from 'date-fns';

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

const paymentRequestRef = ref(null)
const paymentProcessingRef = ref(null)
const paymentProceedRef = ref(null)

export default defineComponent({
  components: { NSpace, NDataTable, NTabs, NTabPane},
    setup() {
      const paymentRequest = ref([])
      const paymentProcessing = ref([])
      const paymentProceed = ref([])

      const formatDate = (date) => {
        return date ? format(new Date(date), 'dd/MM/yyyy') : null;
      };

      const getPayments = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL +'/api/payment'
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                paymentRequest.value = response.data.paymentRequest
                paymentProcessing.value = response.data.paymentProcessing
                paymentProceed.value = response.data.paymentProceed
            } catch (error) {
                console.error(error)
            }
      }

      getPayments()

      const paymentRequestColumns = [
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
        //Program Code
        {
          title: "Program Code",
          key: "program.code",
          resizable: true,
          minWidth: 120,
        },
        //Program Name
        {
          title: "Program Name",
          key: "program.name",
          resizable: true,
          minWidth: 120,
        },
        //Program Type
        {
          title: "Program Type",
          key: "program.type.name",
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
              return row.program.type_id === parseInt(value, 10);
          }
        },
        //Program Status
        {
          title: "Program Status",
          key: "status.name",
          resizable: true,
          minWidth: 130
        },
        //Total Recipient
        {
          title: "Total Recipient",
          key: "total_recipient",
          resizable: true,
          minWidth: 120,
          align: "center",
          sorter: (row1, row2) => (row1.total_recipient || 0) - (row2.total_recipient || 0),
          render: (row) => {
            const formattedAmount = row.total_recipient !== null ? `${row.total_recipient}` : '-';

            return h(
              RouterLink,
              {
                to: {
                  name: 'Receipient-List',
                  params: { id: row.id } 
                }
              },
              formattedAmount
            );
          }
        }
      ];
      const paymentProcessingColumns = [
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
        //Program Code
        {
          title: "Program Code",
          key: "program.code",
          resizable: true,
          minWidth: 120,
        },
        //Program Name
        {
          title: "Program Name",
          key: "program.name",
          resizable: true,
          minWidth: 120,
        },
        //Program Type
        {
          title: "Program Type",
          key: "program.type.name",
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
              return row.program.type_id === parseInt(value, 10);
          }
        },
        //Program Status
        {
          title: "Program Status",
          key: "status.name",
          resizable: true,
          minWidth: 130
        },
        //Total Recipient
        {
          title: "Total Recipient",
          key: "total_recipient",
          resizable: true,
          minWidth: 120,
          align: "center",
          sorter: (row1, row2) => (row1.total_recipient || 0) - (row2.total_recipient || 0),
          render: (row) => {
            const formattedAmount = row.total_recipient !== null ? `${row.total_recipient}` : '-';

            return h(
              RouterLink,
              {
                to: {
                  name: 'Receipient-List',
                  params: { id: row.id } 
                }
              },
              formattedAmount
            );
          }
        }
      ];
      const paymentProceedColumns = [
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
        //Program Code
        {
          title: "Program Code",
          key: "program.code",
          resizable: true,
          minWidth: 120,
        },
        //Program Name
        {
          title: "Program Name",
          key: "program.name",
          resizable: true,
          minWidth: 120,
        },
        //Program Type
        {
          title: "Program Type",
          key: "program.type.name",
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
              return row.program.type_id === parseInt(value, 10);
          }
        },
        //Program Status
        {
          title: "Program Status",
          key: "status.name",
          resizable: true,
          minWidth: 130
        },
        //Total Recipient
        {
          title: "Total Recipient",
          key: "total_recipient",
          resizable: true,
          minWidth: 120,
          align: "center",
          sorter: (row1, row2) => (row1.total_recipient || 0) - (row2.total_recipient || 0),
          render: (row) => {
            const formattedAmount = row.total_recipient !== null ? `${row.total_recipient}` : '-';

            return h(
              RouterLink,
              {
                to: {
                  name: 'Receipient-List',
                  params: { id: row.id } 
                }
              },
              formattedAmount
            );
          }
        }
      ];
      return {
        paymentRequestTable:paymentRequestRef,
        paymentProcessingTable:paymentProcessingRef,
        paymentProceedTable:paymentProceedRef,
        paymentRequestColumns,
        paymentProcessingColumns,
        paymentProceedColumns,
        paymentRequest,
        paymentProcessing,
        paymentProceed,
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