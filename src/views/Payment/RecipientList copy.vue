<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Recipient List</p>

        <n-data-table ref="dataTableInst" :columns="columns" :data="recipientList" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, onBeforeMount, getCurrentInstance } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable } from "naive-ui"
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
    }
})

const dataTableInstRef = ref(null)

export default defineComponent({
  components: { NSpace, NDataTable},
    setup() {
      const recipientList = ref([])
      const formatDate = (date) => {
        return date ? format(new Date(date), 'dd/MM/yyyy') : null;
      };
      const getRecipientList = async (id) => {
            let url = import.meta.env.VITE_BACKEND_URL + `/api/payment/recipient-list/${id}`;
            try {
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                console.log(response.data)
                recipientList.value = response.data.program.recipients
            } catch (error) {
                console.error(error);
            }
        };

        onBeforeMount(() => {
            const instance = getCurrentInstance();
            const routeId = instance.proxy.$route.params.id;
            getRecipientList(routeId);
        });

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
        //Date Created
        {
          title: "Date Created",
          key: "created_at",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
          render: (row) => {
            const formattedDate = formatDate(row.created_at); // Assuming formatDate is a function you've defined
            return formattedDate;
          }
        },
        //Recipient Name
        {
          title: "Recipient Name",
          key: "name",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Account Number
        {
          title: "Account Number",
          key: "account_number",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Disburse Amount
        {
          title: "Disburse Amount",
          key: "individual_recipient.disburse_amount",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        ];
      return {
        dataTableInst: dataTableInstRef,
        columns,
        recipientList,
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