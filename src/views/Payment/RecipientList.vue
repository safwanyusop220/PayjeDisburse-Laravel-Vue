<template>
	<CardCodeExample ref="card">
    <n-space vertical :size="15">
      <p class="font-bold text-xl text-black">LIST OF RECIPIENT</p>
      <!--Individual Program Info-->
      <n-grid v-if="program.type_id == 1" class="px-2" x-gap="" :cols="2">
        <!--Left Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Program Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Name</n-gi>
              <n-gi class="text-sm">: {{ program.name }}</n-gi>
            </n-grid>
            <!--Program Code-->
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
            <!--Organization Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Organization Name</n-gi>
              <n-gi class="text-sm">: {{ program.organization_name }}</n-gi>
            </n-grid>
            <!--Bank Panel-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Bank Panel</n-gi>
              <n-gi class="text-sm">: {{ program.bank_panel }}</n-gi>
            </n-grid>
            <!--Account Number-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Account Number</n-gi>
              <n-gi class="text-sm">: {{ program.account_number }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
      </n-grid>
      <!--Individual Recipient List-->
      <n-data-table v-if="program.type_id == 1" ref="indiviualDataTable" :columns="individualColumns" :data="recipientList" :pagination="pagination" class="shadow-t-md"/>
      <!--Group Table-->
      <!-- <n-space vertical>
        <n-table striped>
          <thead>
            <tr>
              <th>No</th>
              <th>Date Created</th>
              <th>Recipient Name</th>
              <th>Bank </th>
              <th>Account Number</th>
              <th>Disburse Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(recipient, index) in recipientList" :key="recipient.id">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDate(recipient.recipient.created_at) }}</td>
              <td>{{ recipient.recipient.name }}</td>
              <td>{{ recipient.recipient.bank.abbreviation }}</td>
              <td>{{ recipient.recipient.account_number }}</td>
              <td>{{ formatDate(recipient.program.payment_date) }}</td>
              <td>RM {{ recipient.program.disburse_amount }}</td>
            </tr>
          </tbody>
        </n-table>
      </n-space> -->
      <!--Group Program Info-->
      <n-grid v-if="program.type_id == 2" class="px-2" x-gap="" :cols="2">
        <!--Left Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Program Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Name</n-gi>
              <n-gi class="text-sm">: {{ program.name }}</n-gi>
            </n-grid>
            <!--Program Code-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Code</n-gi>
              <n-gi class="text-sm">: {{ program.code }}</n-gi>
            </n-grid>
            <!--Type of Allocation-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Type of Allocation</n-gi>
              <n-gi class="text-sm">: {{ program.type }}</n-gi>
            </n-grid>
            <!--Frequency Type-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Frequency Type</n-gi>
              <n-gi class="text-sm">: {{ program.frequency }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
        <!--Right Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Organization Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Organization Name</n-gi>
              <n-gi class="text-sm">: {{ program.organization_name }}</n-gi>
            </n-grid>
            <!--Bank Panel-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Bank Panel</n-gi>
              <n-gi class="text-sm">: {{ program.bank_panel }}</n-gi>
            </n-grid>
            <!--Account Number-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Account Number</n-gi>
              <n-gi class="text-sm">: {{ program.account_number }}</n-gi>
            </n-grid>
            <!--Amount-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Total Amount</n-gi>
              <n-gi class="text-sm">: RM {{ program.count * program.amount }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
      </n-grid>
      <!--Group Recipient List-->
      <n-data-table v-if="program.type_id == 2" ref="groupDataTable" :columns="groupColumns" :data="recipientList" :pagination="pagination" class="shadow-t-md"/>
      
      <!--Schedule Program Info-->
      <n-grid v-if="program.type_id == 3" class="px-2" x-gap="" :cols="2">
        <!--Left Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Program Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Name</n-gi>
              <n-gi class="text-sm">: {{ program.name }}</n-gi>
            </n-grid>
            <!--Program Code-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Code</n-gi>
              <n-gi class="text-sm">: {{ program.code }}</n-gi>
            </n-grid>
            <!--Type of Allocation-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Type of Allocation</n-gi>
              <n-gi class="text-sm">: {{ program.type }}</n-gi>
            </n-grid>
            <!--Disbursement Amount-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Disbursement Amount</n-gi>
              <n-gi class="text-sm">: RM {{ program.disburse_amount }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
        <!--Right Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Organization Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Organization Name</n-gi>
              <n-gi class="text-sm">: {{ program.organization_name }}</n-gi>
            </n-grid>
            <!--Bank Panel-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Bank Panel</n-gi>
              <n-gi class="text-sm">: {{ program.bank_panel }}</n-gi>
            </n-grid>
            <!--Account Number-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Account Number</n-gi>
              <n-gi class="text-sm">: {{ program.account_number }}</n-gi>
            </n-grid>
            <!--Amount-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Total Amount</n-gi>
              <n-gi class="text-sm">: RM {{ program.count * program.amount }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
      </n-grid>
      <!--Schedule Recipient List-->
      <n-data-table v-if="program.type_id == 3" ref="scheduleDataTable" :columns="scheduleColumns" :data="recipientList" :pagination="pagination" class="shadow-t-md"/>

      <!--Batch Program Info-->
      <n-grid v-if="program.type_id == 4" class="px-2" x-gap="" :cols="2">
        <!--Left Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Program Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Name</n-gi>
              <n-gi class="text-sm">: {{ program.name }}</n-gi>
            </n-grid>
            <!--Program Code-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Program Code</n-gi>
              <n-gi class="text-sm">: {{ program.code }}</n-gi>
            </n-grid>
            <!--Type of Allocation-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Type of Allocation</n-gi>
              <n-gi class="text-sm">: {{ program.type }}</n-gi>
            </n-grid>
            <!--Disbursement Amount-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Disbursement Amount</n-gi>
              <n-gi class="text-sm">: RM {{ program.disburse_amount }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
        <!--Right Data-->
        <n-gi>
          <n-space vertical :size="5">
            <!--Organization Name-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Organization Name</n-gi>
              <n-gi class="text-sm">: {{ program.organization_name }}</n-gi>
            </n-grid>
            <!--Bank Panel-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Bank Panel</n-gi>
              <n-gi class="text-sm">: {{ program.bank_panel }}</n-gi>
            </n-grid>
            <!--Account Number-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Account Number</n-gi>
              <n-gi class="text-sm">: {{ program.account_number }}</n-gi>
            </n-grid>
            <!--Amount-->
            <n-grid x-gap="space-x-12" :cols="2">
              <n-gi class="text-sm font-bold">Total Amount</n-gi>
              <n-gi class="text-sm">: RM {{ program.count * program.amount }}</n-gi>
            </n-grid>
          </n-space>
        </n-gi>
      </n-grid>
      <!--Batch Recipient List-->
      <n-data-table v-if="program.type_id == 4" ref="batchDataTableRef" :columns="batchColumns" :data="recipientList" :pagination="pagination" class="shadow-t-md"/>

    </n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, onBeforeMount, getCurrentInstance } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NDataTable, NSpace, NGrid, NGi, NTable } from "naive-ui"
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
  count: ''
});

const formatDate = (date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : null;
};

const groupDataTableRef = ref(null)
const scheduleDataTableRef = ref(null)
const batchDataTableRef = ref(null)
const indiviualDataTableRef = ref(null)

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
                console.log('recipients', response.data.recipients)
                console.log('count', response.data.recipientCount)
                console.log('program', response.data.programData.program)

                const programData = response.data.programData.program;

                program.value.type_id = programData.type_id || null;


                program.value.name = programData.name || null;
                program.value.code = programData.code || null;
                program.value.type = programData.type.name || null;
                program.value.amount = programData.disburse_amount || null;
                program.value.count = response.data.recipientCount || null;

                program.value.disburse_amount = programData.disburse_amount || null;

                program.value.organization_name = programData.bank_panel.organization_name || null;
                program.value.bank_panel = programData.bank_panel.bank.name || null;
                program.value.account_number = programData.bank_panel.account_number || null;

                if (programData && programData.frequency) {
                  program.value.frequency = programData.frequency.name || null;
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
      const individualColumns = [
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
        //Recipient Name
        {
          title: "Recipient Name",
          key: "recipient.name",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Bank Name
        {
          title: "Bank Name",
          key: "recipient.bank.abbreviation",
          class: "uppercase",
          resizable: true,
          minWidth: 110,
        },
        //Account Number
        {
          title: "Account Number",
          key: "recipient.account_number",
          resizable: true,
          minWidth: 190,
        },
        //Disburse Date
        {
          title: "Disburse Date",
          key: "recipient.individual_recipient.payment_date",
          resizable: true,
          minWidth: 120,
          render: (row) => {
            const formattedDate = formatDate(row.recipient.individual_recipient.payment_date);
            return formattedDate;
          }
        },
        //Amount
        {
          title: "Amount",
          key: "recipient.individual_recipient.disburse_amount",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
          render: (row) => {
            const disburseAmount = row.recipient.individual_recipient?.disburse_amount;
            if (disburseAmount !== null && disburseAmount !== undefined) {
              return `RM ${disburseAmount}`;
            }
            return '-';
          }
        },
      ];
      const groupColumns = [
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
        //Recipient Name
        {
          title: "Recipient Name",
          key: "recipient.name",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Bank Name
        {
          title: "Bank Name",
          key: "recipient.bank.abbreviation",
          class: "uppercase",
          resizable: true,
          minWidth: 110,
        },
        //Account Number
        {
          title: "Account Number",
          key: "recipient.account_number",
          resizable: true,
          minWidth: 190,
        },
        //Disburse Date
        {
          title: "Disburse Date",
          key: "program.payment_date",
          resizable: true,
          minWidth: 120,
          render: (row) => {
            const formattedDate = formatDate(row.program.payment_date); // Assuming formatDate is a function you've defined
            return formattedDate;
          }
        },
        //Amount
        {
          title: "Amount",
          key: "program.disburse_amount",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
          render: (row) => {
            const disburseAmount = row.program?.disburse_amount;
            if (disburseAmount !== null && disburseAmount !== undefined) {
              return `RM ${disburseAmount}`;
            }
            return '-';
          }
        },
      ];
      const scheduleColumns = [
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
        //Recipient Name
        {
          title: "Recipient Name",
          key: "recipient.name",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Bank Name
        {
          title: "Bank Name",
          key: "recipient.bank.abbreviation",
          class: "uppercase",
          resizable: true,
          minWidth: 110,
        },
        //Account Number
        {
          title: "Account Number",
          key: "recipient.account_number",
          resizable: true,
          minWidth: 190,
        },
        //Amount
        {
          title: "Amount",
          key: "program.disburse_amount",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
          render: (row) => {
            const disburseAmount = row.program?.disburse_amount;
            if (disburseAmount !== null && disburseAmount !== undefined) {
              return `RM ${disburseAmount}`;
            }
            return '-';
          }
        },
      ];
      const batchColumns = [
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
        //Recipient Name
        {
          title: "Recipient Name",
          key: "recipient.name",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Bank Name
        {
          title: "Bank Name",
          key: "recipient.bank.abbreviation",
          class: "uppercase",
          resizable: true,
          minWidth: 110,
        },
        //Account Number
        {
          title: "Account Number",
          key: "recipient.account_number",
          resizable: true,
          minWidth: 190,
        },
        //Amount
        {
          title: "Amount",
          key: "program.disburse_amount",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
          render: (row) => {
            const disburseAmount = row.program?.disburse_amount;
            if (disburseAmount !== null && disburseAmount !== undefined) {
              return `RM ${disburseAmount}`;
            }
            return '-';
          }
        },
      ];
      return {
        formatDate,
        program,
        indiviualDataTable: indiviualDataTableRef,
        individualColumns,
        groupDataTable: groupDataTableRef,
        groupColumns,
        scheduleDataTable: scheduleDataTableRef,
        scheduleColumns,
        batchDataTable: batchDataTableRef,
        batchColumns,
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