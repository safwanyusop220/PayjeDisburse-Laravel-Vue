<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Receipient</p>

        <div class="flex justify-between">
            <n-input class="mr-[300px]" placeholder="Search">
              <template #prefix>
                <n-icon :component="MdSearch" />
              </template>
            </n-input>
            <div>
              <n-button  @click="showModal = true" type="primary">
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="80" d="M256 112v288"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="80" d="M400 256H112"></path></svg>
                </n-icon>
                Create
              </n-button>
              <n-modal 
                  v-model:show="showModal"
                  :mask-closable="true"
                  >
                  <n-card
                      style="width: 1000px; margin-top: 50px; margin-bottom: 100px;"
                      title="Create Receipient"
                      :bordered="false"
                      size="huge"
                      role="dialog"                    
                      :style="{background: 'white'}"
                    >
                    <n-scrollbar>
                      <n-form
                          :model="receipient"
                          @submit="submitForm"
                          :label-placement="placement"
                          require-mark-placement="right-hanging"
                          :size="size"
                          :inline="inline"
                          :show-label="showLabel"
                          label-width="auto"
                        >
                        <n-grid x-gap="space-x-5" :cols="2">
                          <!--Left Data-->
                          <n-gi>
                            <!--Name-->
                            <n-form-item label="Receipient Name">
                              <n-input v-model:value="receipient.name" placeholder="Name"/>
                            </n-form-item>
                            <!--Identification-->
                            <n-form-item label="Identification Number">
                              <n-input v-model:value="receipient.identification_number" placeholder="Identification"/>
                            </n-form-item>
                            <!--Address-->
                            <n-form-item label="Receipient Address">
                              <n-input v-model:value="receipient.address" type="textarea" placeholder="Address"/>
                            </n-form-item>
                            <!--Postcode-->
                            <n-form-item label="Postcode Number">
                              <n-input v-model:value="receipient.postcode" placeholder="Postcode"/>
                            </n-form-item>
                            <!--Phone-->
                            <n-form-item label="Phone Number">
                              <n-input v-model:value="receipient.phone_number" placeholder="Phone"/>
                            </n-form-item>
                            <!--Email-->
                            <n-form-item label="Email Address">
                              <n-input v-model:value="receipient.email" placeholder="Email"/>
                            </n-form-item>
                            <!--Bank-->
                            <n-form-item label="Bank Name">
                              <n-select
                                v-model:show="showBank"
                                filterable
                                v-model:value="receipient.bank_id"
                                :options="bankOptions"
                                placeholder="Select an option"
                                >
                                  <template v-if="showBank" #arrow>
                                      <md-search />
                                  </template>
                              </n-select>
                            </n-form-item>
                            <!--Account Number-->
                            <n-form-item label="Account Number">
                              <n-input v-model:value="receipient.account_number" placeholder="Account"/>
                            </n-form-item>
                            <!--Program-->
                            <n-form-item label="Program Name">
                              <n-select
                                v-model:show="showProgram"
                                filterable
                                v-model:value="receipient.program_id"
                                v-model:typeId="receipient.type_id"
                                :options="programOptions"
                                placeholder="Select an option"
                                >
                                  <template v-if="showProgram" #arrow>
                                      <md-search />
                                  </template>
                              </n-select>
                            </n-form-item>
                            {{ receipient.type_id }}
                          </n-gi>
                          <!--Right Data-->
                          <n-gi>
                            <!--Disburse Amount-->
                            <n-form-item label="Disburse Amount" path="disburseAmount">
                              <n-input-number v-model:value="receipient.disburse_amount" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Amount">
                                <template #prefix>
                                  RM
                                </template>
                              </n-input-number>
                            </n-form-item>
                            <!--Frequency-->
                            <n-form-item label="Frequency">
                              <n-radio-group v-model:value="receipient.frequency_id">
                                <n-space vertical>
                                <n-radio
                                    v-for="frequency in frequencies"
                                    :key="frequency.value"
                                    :value="frequency.value"
                                    :label="frequency.label"
                                  />
                                </n-space>
                              </n-radio-group>
                            </n-form-item>
                            <!--Payment Date-->
                            <n-form-item label="Payment Date">
                                <n-input
                                  v-model:value="receipient.payment_date"
                                  type="date"
                                  clearable
                                  placeholder=" "
                                />
                              </n-form-item>
                          </n-gi>
                        </n-grid>
                        <div class="flex justify-end">
                          <n-button @click="submitForm" type="primary">
                            Submit
                          </n-button>
                        </div>
                      </n-form>
                    </n-scrollbar>
                  </n-card>
              </n-modal>
            </div>
        </div>
			<n-data-table ref="dataTableInst" :columns="columns" :data="receipients" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h } from "vue"
import { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NRadio, NSelect, NInputNumber, NScrollbar, NRadioGroup, NGrid, NGi, useMessage, useDialog, useNotification, NDynamicInput, NIcon } from "naive-ui"
import axios from 'axios'
import MdSearch from "@vicons/ionicons4/MdSearch";
import MdAddCircleOutline from "@vicons/ionicons4/MdAddCircleOutline";
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
    }
})

const dataTableInstRef = ref(null)

export default defineComponent({
  components: { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NRadio, NSelect, MdSearch, NInputNumber, NScrollbar, NRadioGroup, NGrid, NGi, NDynamicInput, NIcon},
    setup() {
        const receipients = ref([])
        const programs = ref([])
        const banks = ref([])
        const programOptions = ref([]);
        const bankOptions = ref([]);
        const checkedValueRef = ref(null);
        const checkedValueFrequencyRef = ref(null);
        const showModalRef = ref(false);
        const message = useMessage();
        const dialog = useDialog();
        const modalRef = ref(null);
        const notification = useNotification();

        const receipient = ref({
          name: '',
          identification_number: '',
          address: '',
          postcode: '',
          phone_number: '',
          email: '',
          bank_id: '',
          account_number: '',
          program_id: '',

          disburse_amount: '',
          frequency_id: '',
          payment_date: ''
        });

        const submitForm = async () => {
          console.log('Form data:', receipient.value);
          try {
            const response = await axios.post('http://127.0.0.1:8000/api/receipients/store', receipient.value);
            console.log('API response:', response.data);
            showModalRef.value = false;
          } catch (error) {
            console.error('API error:', error);
          }
          window.location.reload();
        };
        
        const getReceipients = async () => {
            try {
                const url = 'http://127.0.0.1:8000/api/receipients'
                const response = await axios.get(url)
                receipients.value = response.data.receipients
                console.log(receipients.value)
            } catch (error) {
                console.error(error)
            }
        }
        getReceipients()

        const getPrograms = async () => {
            try {
                const url = 'http://127.0.0.1:8000/api/receipients/programs';
                const response = await axios.get(url);
                programs.value = response.data.programs;

                programOptions.value = response.data.programs.map(program => ({
                    label: program.name,
                    value: program.id,
                    type: program.type.id
                }));

                console.log(programs.value);
                console.log(programOptions.value);
            } catch (error) {
                console.error(error);
            }
        };
        getPrograms()

        const getBanks = async () => {
            try {
                const url = 'http://127.0.0.1:8000/api/receipients/banks';
                const response = await axios.get(url);
                banks.value = response.data.banks;

                bankOptions.value = response.data.banks.map(bank => ({
                    label: bank.name,
                    value: bank.id
                }));

                console.log(banks.value);
                console.log(bankOptions.value);
            } catch (error) {
                console.error(error);
            }
        };
        getBanks()

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
        //Name
        {
          title: "Name",
          key: "name",
          resizable: true,
          minWidth: 130,
        },
        //Program Code
        {
          title: "Program Code",
          key: "program.code",
          resizable: true,
          minWidth: 130,
        },
        //Program Name
        {
          title: "Program",
          key: "program.name",
          resizable: true,
          minWidth: 130,
        },
        //Program Type
        {
          title: "Program Type",
          key: "program.type.name",
          resizable: true,
          minWidth: 130,
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
          key: "actions",	 
          width:70,
            render(row) {
            return h(
              NButton,
              {
              strong: true,
              tertiary: true,
              size: "tiny",
              onClick: () => play(row)
              },
              { default: () => "View" }
            );
          }
        }
        ];
        return {
          Add12Filled,
          MdSearch,
          MdAddCircleOutline,
          dynamicInputRule: {
            trigger: "input",
            validator(rule, value) {
              if (value.length >= 5)
                return new Error("Input up to 4 characters");
              return true;
            }
          },
          model: ref({
            dynamicInputValue: [{ value: "", name: "" }]
          }),
          onCreate() {
            return {
              name: "",
              value: ""
            };
          },
          notify(type) {
            notification[type]({
              content: "What to say?",
              meta: "I don't know",
              duration: 2500,
              keepAliveOnHover: true
            });
          },
          showModaltest: modalRef,
          receipient,
          submitForm,
          programTypes: [
            {
              value: "1",
              label: "Individual"
            },
            {
              value: "2",
              label: "Group"
            },
            {
              value: "3",
              label: "Schedule"
            },
            {
              value: "4",
              label: "Batch"
            }
          ],
          frequencies: [
            {
              value: "1",
              label: "One Time"
            },
            {
              value: "2",
              label: "Monthly"
            },
            {
              value: "3",
              label: "Yearly"
            },
            {
              value: "4",
              label: "Multiple"
            },
          ],
          parseCurrency: (input) => {
            const nums = input.replace(/(,|\$|\s)/g, "").trim();
            if (/^\d+(\.(\d+)?)?$/.test(nums))
              return Number(nums);
            return nums === "" ? null : Number.NaN;
          },
          formatCurrency: (value) => {
            if (value === null)
              return "";
            return `${value.toLocaleString("en-MY")}`;
          },
          showBank: ref(false),
          bankOptions,
          showProgram: ref(false),
          programOptions,
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
          handleSuccess() {
            dialog.success({
              title: "Success",
              content: "Cool",
              positiveText: "Wow!",
              onPositiveClick: () => {
                message.success("Great!");
              }
            });
          },
          disabled: ref(true),
          receipients,
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
          // clearForm,
        }
    },
    
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