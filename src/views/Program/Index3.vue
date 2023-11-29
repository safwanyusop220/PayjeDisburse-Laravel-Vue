<template>
	<CardCodeExample title="Program" ref="card">
		<n-space vertical :size="12">
        <div class="flex justify-between">
          <div class="space-x-3">
            
          </div>
          <div class="space-x-1">
            <n-button  @click="clearFilters" type="warning">!</n-button>
            <n-button  @click="clearSorter" type="warning">?</n-button>
            <n-button @click="showModal = true" type="primary">+</n-button>
            <n-modal 
                v-model:show="showModal"
                :mask-closable="true"
                >
                <n-card
                    style="width: 1000px; margin-top: 50px; margin-bottom: 100px;"
                    title="Create Program"
                    :bordered="false"
                    size="huge"
                    role="dialog"                    
                    :style="{
                          background: 'white'
                      }"
                  >
                  <n-scrollbar>
                    <div class="alert alert-danger mt-4" v-if="errors.length">
                        <ul class="mb-0">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error }}
                            </li>
                        </ul>
                    </div>
                    <n-form @submit.prevent="store" novalidate
                        :model="program"
                        :label-placement="placement"
                        require-mark-placement="right-hanging"
                        :size="size"
                        :inline="inline"
                        :show-label="showLabel"
                        label-width="auto"
                      >
                      <!--Program Name-->
                      <n-form-item label="Program Name" path="brandValue">
                        <n-input v-model="program.name" placeholder="Name"/>
                      </n-form-item>
                      <!--Program Code-->
                      <n-form-item label="Program Code" path="programCode">
                        <n-input v-model="program.code" placeholder="Code"/>
                      </n-form-item>
                      <!--Program Type-->
                      <n-form-item v-model="program.type_id" label="Program Type" path="programType">
                        <n-space vertical>
                          <n-radio
                              :checked="checkedValue === 'Individual'"
                              v-model="program.type_id"
                              value="Individual"
                              name="type"
                              @change="handleChange"
                            >
                            Individual
                          </n-radio>
                          <n-radio
                              :checked="checkedValue === 'Group'"
                              v-model="program.type_id"
                              value="Group"
                              name="type"
                              @change="handleChange"
                            >
                            Group
                          </n-radio>
                          <n-radio
                              :checked="checkedValue === 'Schedule'"
                              v-model="program.type_id"
                              value="Schedule"
                              name="type"
                              @change="handleChange"
                            >
                            Schedule
                          </n-radio>
                          <n-radio
                              :checked="checkedValue === 'Batch'"
                              v-model="program.type_id"
                              value="Batch"
                              name="type"
                              @change="handleChange"
                            >
                            Batch
                          </n-radio>
                        </n-space>
                      </n-form-item>
                      <!--Bank Panel-->
                      <n-form-item label="Bank Panel" path="panelBank">
                        <n-select
                          v-model:show="show2"
                          filterable
                          placeholder="Select Bank"
                          :options="options"
                          v-model="program.bank_panel"
                          >
                          <template v-if="show2" #arrow>
                            <md-search />
                          </template>
                        </n-select>
                      </n-form-item>
                      <!--disburse Amount-->
                      <n-form-item label="Disburse Amount" path="disburseAmount">
                        <n-input-number v-model="program.disburse_amount"  :parse="parseCurrency" :format="formatCurrency"  :show-button="false"/>
                      </n-form-item>
                      <!--Program Type-->
                      <n-form-item label="Frequency" path="frequency">
                        <n-space vertical>
                          <n-radio
                              :checked="checkedValueFrequency === 'Monthly'"
                              v-model="program.frequency"
                              value="Monthly"
                              name="type"
                              @change="handleChangeFrequency"
                            >
                            Monthly
                          </n-radio>
                          <n-radio
                              :checked="checkedValueFrequency === 'Yearly'"
                              v-model="program.frequency"
                              value="Yearly"
                              name="type"
                              @change="handleChangeFrequency"
                            >
                            Yearly
                          </n-radio>
                          <n-radio
                              :checked="checkedValueFrequency === 'OneTime'"
                              v-model="program.frequency"
                              value="OneTime"
                              name="type"
                              @change="handleChangeFrequency"
                            >
                            One Time
                          </n-radio>
                        </n-space>
                      </n-form-item>
                      <!--Payment Date-->
                      <n-form-item label="Payment Date" path="paymentDate">
                        <n-date-picker type="date" />
                      </n-form-item>
                      <!--Total Month-->
                      <n-form-item label="Total Month" path="totalMonth">
                        <n-input-number :show-button="false"/>
                      </n-form-item>
                      <div class="flex justify-end">
                        <n-button html-type="submit" type="primary">
                          Submit
                        </n-button>
                      </div>
                    </n-form>
                  </n-scrollbar>
                </n-card>
            </n-modal>
          </div>
      </div>
			<n-data-table ref="dataTableInst" :columns="columns" :data="programs" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive } from "vue"
import { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NRadio, NSelect, NInputNumber, NDatePicker, NScrollbar} from "naive-ui"
import axios from 'axios'
import MdSearch from "@vicons/ionicons4/MdSearch";

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
    setup() {
        const programs = ref([])
        const checkedValueRef = ref(null);
        const checkedValueFrequencyRef = ref(null);
        const showModalRef = ref(false);

        const program = ref({
          name: '',
          code: '',
          type_id: '',
          disburse_amount: '',
          period: '',
        });

        const errors = ref([]);

        const store = () => {
          errors.value = [];

          if (!program.value.name) {
            errors.value.push("Name is required");
          }

          if (errors.value.length === 0) {
            alert('Form submitted successfully')
            console.log('Form submitted successfully');
          }
        };
        
        const getPrograms = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL +'/api/programs'
                const response = await axios.get(url)
                programs.value = response.data.programs
                console.log(programs.value)
            } catch (error) {
                console.error(error)
            }
        }

        getPrograms()

        const columns = [
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
        {
          title: "Program Code",
          key: "code",
          resizable: true,
          minWidth: 120,
        },
        {
          title: "Program Name",
          key: "name",
          resizable: true,
          minWidth: 130,
        },
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
        {
          title: "Disburse Amount",
          key: "disburse_amount",
          resizable: true,
          minWidth: 170,
          sorter: (row1, row2) => row1.disburse_amount - row2.disburse_amount

        },
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
        {
          title: "Program Period",
          key: "period",
          resizable: true,
          minWidth: 170,
        }
      ];
        return {
          parseCurrency: (input) => {
            const nums = input.replace(/(,|\$|\s)/g, "").trim();
            if (/^\d+(\.(\d+)?)?$/.test(nums))
              return Number(nums);
            return nums === "" ? null : Number.NaN;
          },
          formatCurrency: (value) => {
            if (value === null)
              return "";
            return `${value.toLocaleString("en-MY")} $`;
          },
          show2: ref(false),
          options: [
            {
              label: "Maybank",
              value: "1"
            },
            {
              label: "Public Bank",
              value: "2"
            },
            {
              label: "Cimb Bank",
              value: "3"
            }
          ],
          checkedValue: checkedValueRef,
          handleChange(e) {
            checkedValueRef.value = e.target.value;
          },
          checkedValueFrequency: checkedValueFrequencyRef,
          handleChangeFrequency(e) {
            checkedValueFrequencyRef.value = e.target.value;
          },
          placement: ref("left"),
          showModal: showModalRef,
          onPositiveClick() {
            message.success("Submit");
            showModalRef.value = false;
          },
          onNegativeClick() {
            message.success("Cancel");
            showModalRef.value = false;
          },
          disabled: ref(true),
          programs,
          columns,
          dataTableInst: dataTableInstRef,
          pagination,
          filterAddress() {
            dataTableInstRef.value.filter({
              address: ["London"]
            })
          },
          sortName() {
            dataTableInstRef.value.sort("name", "ascend")
          },
          clearFilters() {
            dataTableInstRef.value.filter(null)
          },
          clearSorter() {
            dataTableInstRef.value.sort(null)
          },
          store,
          program,
          errors,
        }
    },
    components: { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NRadio, NSelect, MdSearch, NInputNumber, NDatePicker, NScrollbar }
})
</script>

<style scoped>
:deep(.slide-left-enter-active),
:deep(.slide-left-leave-active) {
  transition: transform 0.3s ease, opacity 0.3s ease;
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