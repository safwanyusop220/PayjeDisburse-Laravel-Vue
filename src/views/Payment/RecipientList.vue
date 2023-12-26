<template>
	<CardCodeExample ref="card">
    <n-space vertical :size="15">
      <p class="font-bold text-xl text-black">LIST OF RECIPIENT</p>
      <n-grid class="px-2" x-gap="" :cols="2">
        <!--Left Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Program Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Name</n-gi>
              <n-gi class="text-sm">: {{ program.name }}</n-gi>
            </n-grid>
            <!--Program Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Code</n-gi>
              <n-gi class="text-sm">: {{ program.code }}</n-gi>
            </n-grid>
            <!--Type of Allocation-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Type of Allocation</n-gi>
              <n-gi class="text-sm">: {{ program.type }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
        <!--Right Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Frequency Type-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Frequency Type</n-gi>
              <n-gi class="text-sm">: {{ program.frequency }}</n-gi>
            </n-grid>
            <!--Amount-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Amount</n-gi>
              <n-gi class="text-sm">: RM{{ program.amount }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
      </n-grid>

      <n-data-table ref="dataTableInst" :columns="columns" :data="recipientList" :pagination="pagination" class="shadow-t-md"/>
    </n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, onBeforeMount, getCurrentInstance } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NDataTable, NSpace, NGrid, NGi } from "naive-ui"
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

const program = ref({
  name: '',
  code: '',
  type: '',
  frequency: '',
  amount: '',
});

const dataTableInstRef = ref(null)

export default defineComponent({
  components: { NDataTable, NSpace, NGrid, NGi },
    setup() {
      const recipientList = ref([])
      const formatDate = (date) => {
        return date ? format(new Date(date), 'dd/MM/yyyy') : null;
      };
      const getRecipientList = async (id) => {
            let url = import.meta.env.VITE_BACKEND_URL + `/api/payment/recipient-list/${id}`;
            try {
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                console.log(response)
                console.log('program', response.data.programData.program)

                const programData = response.data.programData.program;
                program.value.name = programData.name || null;
                program.value.code = programData.code || null;
                program.value.type = programData.type.name || null;
                program.value.amount = programData.disburse_amount || null;

                try {
                  if (programData && programData.frequency) {
                    program.value.frequency = programData.frequency.name || null;
                  } else {
                    // console.warn('Frequency data is not available.');
                  }
                  } catch (innerError) {
                    console.error('Error handling frequency data:', innerError);
                }

                recipientList.value = response.data.recipients
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
          title: "Amount",
          key: "individual_recipient.disburse_amount",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
          render: (row) => {
            const disburseAmount = row.individual_recipient?.disburse_amount;
            if (disburseAmount !== null && disburseAmount !== undefined) {
              return `RM ${disburseAmount}`;
            }
            return '-';
          }
        },
      ];
      return {
        program,
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