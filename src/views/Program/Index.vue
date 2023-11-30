<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Program</p>

        <div class="flex justify-between">
            <n-input class="mr-[300px]" placeholder="Search">
              <template #prefix>
                <n-icon :component="MdSearch" />
              </template>
            </n-input>
            <div>
              <n-button  @click="showModal = true" type="success">
                <n-icon :component="Add12Filled" size="17" class="mr-1"/>
                Create
              </n-button>
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
                      :style="{background: 'white'}"
                    >
                    <n-scrollbar>
                      <n-form
                          :model="program"
                          @submit="submitForm"
                          :label-placement="placement"
                          require-mark-placement="right-hanging"
                          label-width="auto"
                        >
                        <!--Program Name/Code-->
                        <n-grid x-gap="22" :cols="2">
                          <n-gi>
                            <n-form-item label="Program Name">
                              <n-input class="w-1/2" v-model:value="program.name" placeholder="Name"/>
                            </n-form-item>
                          </n-gi>
                          <n-gi>
                            <n-form-item label="Program Code">
                              <n-input v-model:value="program.code" placeholder="Code"/>
                            </n-form-item>
                          </n-gi>
                        </n-grid>
                        <!--ProgramType-->
                        <n-grid x-gap="" :cols="2">
                          <n-gi>
                            <n-form-item label="Program Type">
                              <n-radio-group v-model:value="program.type_id" name="programType">
                                <n-space vertical>
                                <n-radio
                                    v-for="programType in programTypes"
                                    :key="programType.value"
                                    :value="programType.value"
                                    :label="programType.label"
                                  />
                                </n-space>
                              </n-radio-group>
                            </n-form-item>
                          </n-gi>
                        </n-grid>
                        <!--Bank Panel-->
                        <n-grid x-gap="" :cols="2">
                          <n-gi>
                            <n-form-item label="Bank Panel">
                              <n-select
                                v-model:show="showPanelBank"
                                filterable
                                :options="bankOptions"
                                v-model:value="program.bank_panel"
                                :placeholder="'Select an option'"
                                >
                                <template v-if="showPanelBank" #arrow>
                                  <md-search />
                                </template>
                              </n-select>
                            </n-form-item>
                          </n-gi>
                        </n-grid>
                        <!--Group-->
                        <template v-if="program.type_id == 2">
                          <!--disburse Amount-->
                          <n-grid x-gap="12" :cols="2">
                            <n-gi>
                              <n-form-item label="Disburse Amount" path="disburseAmount">
                                <n-input-number v-model:value="program.disburse_amount" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Amount">
                                  <template #prefix>
                                    RM
                                  </template>
                                </n-input-number>
                              </n-form-item>
                            </n-gi>
                          </n-grid>
                          
                          <!--Frequency-->
                          <n-form-item label="Frequency">
                            <n-radio-group v-model:value="program.frequency_id">
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
                          <n-grid x-gap="12" :cols="2">
                            <n-gi>
                              <n-form-item label="Payment Date">
                                <n-input
                                  v-model:value="program.payment_date"
                                  type="date"
                                  clearable
                                  placeholder=" "
                                />
                              </n-form-item>
                            </n-gi>
                          </n-grid>
                          <template v-if="program.frequency_id == 2">
                            <!--Total Month-->
                            <n-grid x-gap="12" :cols="2">
                              <n-gi>
                                <n-form-item label="Total Month">
                                  <n-input-number class="w-full" v-model:value="program.total_month" :show-button="false"/>
                                </n-form-item>
                              </n-gi>
                            </n-grid>
                          </template>
                          <template v-if="program.frequency_id == 3">
                            <!--Total Month-->
                            <n-grid x-gap="12" :cols="2">
                              <n-gi>
                                <n-form-item label="Total Year">
                                  <n-input-number class="w-full" v-model:value="program.total_year" :show-button="false"/>
                                </n-form-item>
                              </n-gi>
                            </n-grid>
                          </template>
                        </template>
                        <!--Schedule-->
                        <template v-if="program.type_id == 3">
                          <!--Disburse Amount-->
                          <n-grid x-gap="" :cols="2">
                            <n-gi>
                                <n-form-item label="Disburse Amount" path="disburseAmount">
                                <n-input-number v-model:value="program.disburse_amount" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Amount">
                                  <template #prefix>
                                    RM
                                  </template>
                                </n-input-number>
                              </n-form-item>
                            </n-gi>
                          </n-grid>
                          <!--Schedular Payment-->
                          <n-grid x-gap="" :cols="1">
                            <n-gi>
                              <n-form-item label="Schedular Payment">
                                <n-dynamic-input
                                  v-model:value="program.dynamicInputValue"
                                  class="w-full"
                                  item-style="margin-bottom: -15px;"
                                  :on-create="onCreate"
                                  #="{ index, value }"
                                >
                                  <div style="display: flex">
                                    <n-form-item
                                      ignore-path-change
                                      :show-label="false"
                                      size="medium"
                                      :path="`program.dynamicInputValue[${index}].value`"
                                      :rule="testValidation"
                                      >
                                      <n-input-number
                                        v-model:value="program.dynamicInputValue[index].value"
                                        placeholder="Amount" @keydown.enter.prevent
                                        class="w-full text-sm" :parse="parseCurrency" :format="formatCurrency"  
                                        :show-button="false">
                                        <template #prefix>
                                          RM
                                        </template>
                                      </n-input-number>
                                    </n-form-item>
                                    <div style="height: 34px; line-height: 34px; margin: 0 4px">
                                    </div>
                                    <n-form-item
                                      ignore-path-change
                                      :show-label="false"
                                      size="medium"
                                      :path="`program.dynamicInputValue[${index}].name`"
                                      :rule="testValidation"
                                    >
                                      <n-input
                                        type="date"
                                        v-model:value="program.dynamicInputValue[index].payment_date"
                                        placeholder=""
                                        @keydown.enter.prevent
                                      />
                                    </n-form-item>
                                    
                                  </div>
                                </n-dynamic-input>
                              </n-form-item>
                              <!-- <pre>{{ JSON.stringify(program.dynamicInputValue, null, 2) }}</pre> -->
                            </n-gi>
                          </n-grid>
                        </template>
                        <!--Batch-->
                        <template v-if="program.type_id == 4">
                          <!--Disburse Amount-->
                          <n-grid x-gap="" :cols="2">
                            <n-gi>
                                <n-form-item label="Disburse Amount" path="disburseAmount">
                                <n-input-number v-model:value="program.disburse_amount" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Amount">
                                  <template #prefix>
                                    RM
                                  </template>
                                </n-input-number>
                              </n-form-item>
                            </n-gi>
                          </n-grid>
                          <!--Schedular Payment-->
                          <n-grid x-gap="" :cols="1">
                            <n-gi>
                              <n-form-item label="Schedular Payment">
                                <n-dynamic-input
                                  v-model:value="program.dynamicInputValue"
                                  class="w-full"
                                  item-style="margin-bottom: -15px;"
                                  :on-create="onCreate"
                                  #="{ index, value }"
                                >
                                  <div style="display: flex">
                                    <n-form-item
                                      ignore-path-change
                                      :show-label="false"
                                      size="medium"
                                      :path="`program.dynamicInputValue[${index}].name`"
                                      :rule="testValidation"
                                    >
                                    <n-input
                                      v-model:value="program.dynamicInputValue[index].name"
                                      placeholder="Title" @keydown.enter.prevent
                                      class="w-full" :parse="parseCurrency" :format="formatCurrency"  
                                      :show-button="false"/>
                                    </n-form-item>
                                    <div style="height: 34px; line-height: 34px; margin: 0 8px">
                                    </div>
                                    <n-form-item
                                      ignore-path-change
                                      :show-label="false"
                                      size="medium"
                                      :path="`program.dynamicInputValue[${index}].payment_date`"
                                      :rule="testValidation"
                                    >
                                      <n-input
                                        type="date"
                                        v-model:value="program.dynamicInputValue[index].payment_date"
                                        placeholder=""
                                        @keydown.enter.prevent
                                      />
                                    </n-form-item>
                                  </div>
                                </n-dynamic-input>
                              </n-form-item>
                            </n-gi>
                          </n-grid>
                        </template>
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
			<n-data-table ref="dataTableInst" :columns="columns" :data="programs" :pagination="pagination" />
      <n-modal
        v-model:show="showProgram"
        :mask-closable="true"
        >
        <n-card
            style="width: 1000px; margin-top: 50px; margin-bottom: 100px;"
            title=""
            :bordered="false"
            size="huge"
            role="dialog"                    
            :style="{background: 'white'}"
          >
          <n-form
              :model="showProgramView"
              require-mark-placement="right-hanging"
              label-width="auto"
            >
            <p class="text-lg font-bold mb-1">General Details</p>
            <!--Program Name/Code-->
            <n-grid x-gap="22" :cols="2">
              <n-gi>
                <n-form-item label="Program Name">
                  <n-input class="w-1/2" v-model:value="showProgramView.name" readonly/>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="Program Code">
                  <n-input v-model:value="showProgramView.code" readonly/>
                </n-form-item>
              </n-gi>
            </n-grid>
            <!--Program type/Panel Bank-->
            <n-grid x-gap="22" :cols="2">
              <n-gi>
                <n-form-item label="Program Type">
                  <n-input class="w-1/2" v-model:value="showProgramView.type.name" readonly/>
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="Bank Panel">
                  <n-input v-model:value="formattedBankPanel" readonly/>
                </n-form-item>
              </n-gi>
            </n-grid>
            <!--Group Type-->
            <template v-if="showProgramView.type_id == 2">
              <p class="text-lg font-bold mb-1">Payment Details</p>
              <!--Disburse Amount/Frequency-->
              <n-grid x-gap="22" :cols="2">
                <n-gi>
                  <n-form-item label="Disburse Amount">
                    <n-input-number class="w-full" v-model:value="showProgramView.disburse_amount" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" readonly>
                      <template #prefix>
                        RM
                      </template>
                    </n-input-number>
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="Frequency">
                    <n-input v-model:value="showProgramView.frequency.name" readonly/>
                  </n-form-item>
                </n-gi>
              </n-grid>
              <!--Payment Date/-->
              <n-grid x-gap="22" :cols="2">
                <n-gi>
                  <n-form-item label="Payment Date">
                    <n-input class="w-1/2" v-model:value="showProgramView.payment_date" readonly/>
                  </n-form-item>
                </n-gi>
              </n-grid>
              <!--Monthly-->
              <template v-if="showProgramView.frequency_id == 2">
                <n-grid x-gap="22" :cols="2">
                  <n-gi>
                    <n-form-item label="Total Months">
                      <n-input class="w-1/2" v-model:value="formattedMonth" readonly/>
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="End Date">
                      <n-input class="w-1/2" v-model:value="showProgramView.end_date" readonly/>
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </template>
              <!--Yearly-->
              <template v-if="showProgramView.frequency_id == 3">
                <n-grid x-gap="22" :cols="2">
                  <n-gi>
                    <n-form-item label="Total Years">
                      <n-input class="w-1/2" v-model:value="formattedYear" readonly/>
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="End Date">
                      <n-input class="w-1/2" v-model:value="showProgramView.end_date" readonly/>
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </template>

            </template>
            <!--Schedule Type-->
            <template v-if="showProgramView.type_id == 3">
              <p class="text-lg font-bold mb-1">Payment Details</p>
              <!--Disburse Amount/Frequency-->
              <n-grid x-gap="22" :cols="2">
                <n-gi>
                  <n-form-item label="Disburse Amount">
                    <n-input-number class="w-full" v-model:value="showProgramView.disburse_amount"  :parse="parseCurrency" :format="formatCurrency"  :show-button="false" readonly>
                      <template #prefix>
                        RM
                      </template>
                    </n-input-number>
                  </n-form-item>
                </n-gi>
              </n-grid>
              <!--Disburse Schedular Payment/Date-->
              <p class="text-lg font-bold mb-2">Schedular Details</p>
              <n-grid x-gap="22" :cols="4" class="py-1">
                <n-gi><p class="text-black text-sm -mt-3">Schedular Amount</p></n-gi>
                <n-gi><p class="text-black text-sm -mt-3">Payment Date</p></n-gi>
              </n-grid>
              <!--Dynamic Input-->
              <template v-for="(installment, index) in showProgramView.installment_data" :key="index">
                <n-grid x-gap="22" :cols="4" class="py-1">
                    <n-gi>
                        <n-input-number class="w-full" :value="installment.amount" :parse="parseCurrency" :format="formatCurrency" :show-button="false" readonly>
                          <template #prefix>
                            RM
                          </template>
                        </n-input-number>
                    </n-gi>
                    <n-gi>
                        <n-input class="w-1/2" readonly :value="installment.payment_date" />
                    </n-gi>
                </n-grid>
              </template>

            </template>
            <!--Batch Type-->
            <template v-if="showProgramView.type_id == 4">
              <p class="text-lg font-bold mb-1">Payment Details</p>
              <!--Disburse Amount/Frequency-->
              <n-grid x-gap="22" :cols="2">
                <n-gi>
                  <n-form-item label="Disburse Amount">
                    <n-input-number class="w-full" v-model:value="showProgramView.disburse_amount" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" readonly>
                      <template #prefix>
                        RM
                      </template>
                    </n-input-number>
                  </n-form-item>
                </n-gi>
              </n-grid>
              <!--Disburse Schedular Payment/Date-->
              <p class="text-lg font-bold mb-2">Batch Details</p>
              <n-grid x-gap="22" :cols="4" class="py-1">
                <n-gi><p class="text-black text-sm -mt-3">Batch Name</p></n-gi>
                <n-gi><p class="text-black text-sm -mt-3">Payment Date</p></n-gi>
              </n-grid>
              <template v-for="(installment, index) in showProgramView.installment_data" :key="index">
                <n-grid x-gap="22" :cols="4" class="py-1">
                    <n-gi>
                        <n-input class="w-1/2" readonly :value="installment.name" />
                    </n-gi>
                    <n-gi>
                        <n-input class="w-1/2" readonly :value="installment.payment_date" />
                    </n-gi>
                </n-grid>
              </template>
            </template>
          </n-form>
        </n-card>
      </n-modal>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h, computed } from "vue"
import { RouterLink } from "vue-router"
import { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NRadio, NSelect, NInputNumber, NScrollbar, NRadioGroup, NGrid, NGi, useMessage, useDialog, useNotification, NDynamicInput, NIcon  } from "naive-ui"
import axios from 'axios'
import { format } from 'date-fns';
import MdSearch from "@vicons/ionicons4/MdSearch";
import MdAddCircleOutline from "@vicons/ionicons4/MdAddCircleOutline";
import Add12Filled from "@vicons/fluent/Add12Filled";
import IosEye from "@vicons/ionicons4/IosEye";

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
  components: { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NGrid, NGi, NInput, NRadio, NSelect, MdSearch, NInputNumber, NScrollbar, NRadioGroup,  NDynamicInput, NIcon},
    setup() {
        const programs = ref([])
        const checkedValueRef = ref(null);
        const checkedValueFrequencyRef = ref(null);
        const showModalRef = ref(false);
        const message = useMessage();
        const dialog = useDialog();
        const modalRef = ref(null);
        const notification = useNotification();
        const showProgram = ref(false);

        const bankOptions = ref([]);
        const bankPanels = ref([])

        const installment_data = ref([])
       
        const program = ref({
          name: '',
          code: '',
          disburse_amount: 0,
          type_id: '1',
          bank_panel: '',
          frequency_id: '',
          payment_date: '',
          total_month: '',
          amount: 0,
          dynamicInputValue: []
        });

        const showProgramView = reactive({
          name: '',
          code: '',
          disburse_amount: 0,
          type_id: '',
          type: '',
          frequency: '',
          bank_panel: {
            holder_name: '',
            bank: '',
            account_number: ''
          },
          frequency_id: '',
          payment_date: '',
          total_month: '',
          end_date: '',
          installment_data: []
        });

        const formatDate = (date) => {
          return date ? format(new Date(date), 'dd/MM/yyyy') : null;
        };

        const getBanks = async () => {
          try {
              const url = import.meta.env.VITE_BACKEND_URL +'/api/programs/bank-panel';
              const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}});
              bankPanels.value = response.data.bankPanels;

              bankOptions.value = response.data.bankPanels.map(bankPanel => ({
                  label: `${bankPanel.bank.name} (${bankPanel.holder_name} - ${bankPanel.account_number})`,
                  value: bankPanel.id
              }));
              // console.log(bankPanels.value);
              // console.log(bankOptions.value);
          } catch (error) {
              console.error(error);
          }
        };
        getBanks()

        const view = async (id) => {
          showProgram.value = true;
          let url = import.meta.env.VITE_BACKEND_URL +`/api/programs/show/${id}`;

          try {
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            // console.log(response);

            const programData = response.data.program;

            showProgramView.name = programData.name || null;
            showProgramView.code = programData.code || null;
            showProgramView.type = programData.type || null;
            showProgramView.type_id = programData.type_id || null;
            showProgramView.bank_panel = programData.bank_panel || null;
            showProgramView.disburse_amount = programData.disburse_amount || null;
            showProgramView.frequency_id = programData.frequency_id || null;
            showProgramView.frequency = programData.frequency || null;
            showProgramView.payment_date = formatDate(programData.payment_date) || null;
            showProgramView.total_month = programData.total_month || null;
            showProgramView.total_year = programData.total_year || null;
            showProgramView.end_date = programData.end_date || null;

            if (response && response.data && response.data.installmentPrograms) {
              showProgramView.installment_data = response.data.installmentPrograms.map(installment => ({
                amount: installment.amount || null,
                payment_date: installment.payment_date || null,
                name: installment.name || null,
              }));
            console.log('checkvalue', showProgramView.installment_data);

            } else {
              console.error('Invalid or empty response data');
            }

          } catch (error) {
            console.error(error);
          }
        };
              // console.log('checkvalue', showProgramView.installment_data[0].amount);
            // const installmentPrograms = response.data.installmentPrograms;

        const formattedBankPanel = computed(() => {
          const bankPanel = showProgramView.bank_panel;

          if (bankPanel) {
            return `${bankPanel.bank.name} (${bankPanel.holder_name} - ${bankPanel.account_number})`;
          }
          return ''; 
        });

        const formattedMonth = computed(() => {
          const month = showProgramView.total_month;

          if (month) {
            return `${month} Months`;
          }
          return ''; 
        });

        const formattedYear = computed(() => {
          const year = showProgramView.total_year;

          if (year) {
            return `${year} Years`;
          }
          return ''; 
        });


        const submitForm = async () => {
          console.log('Form data:', program.value);
          console.log('Dynamic Input:', JSON.stringify(program.value.dynamicInputValue, null, 2));
          try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL +'/api/programs/store', program.value, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            console.log('API response:', response.data);
            showModalRef.value = false;
            clearForm();
          } catch (error) {
            console.error('API error:', error);
          }
          window.location.reload();
        };

        const clearForm = () => {
          program.value = {
            name: '',
            code: '',
            disburse_amount: '',
            type_id: '1',
            bank_panel: '',
            frequency_id: '',
            payment_date: '',
            total_month: ''
          };
        };
        
        const getPrograms = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL +'/api/programs'
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                programs.value = response.data.programs
                // console.log(programs.value)
            } catch (error) {
                console.error(error)
            }
        }

        getPrograms()

        const destroy = async (id) => {
          let url = import.meta.env.VITE_BACKEND_URL +`/api/programs/destroy/${id}`;
          await axios.delete(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(response => {
            if(response.data.code == 200) {
              alert(response.data.message);
              window.location.reload();
             }
          }).catch(error => {
              console.log(error);
          });
        };

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
          sorter: (row1, row2) => row1.disburse_amount - row2.disburse_amount,
          render: (row) => {
            // Format disburse_amount with "RM" prefix
            const formattedAmount = `RM ${row.disburse_amount}`;
            return formattedAmount;
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
          key: "id",	 
          align: "center",
          width: 160,
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
                  () => "View"
                ),
                h(
                  RouterLink,
                  {
                    to: {
                      name: 'Program-Edit',
                      params: { id: row.id } 
                    }
                  },
                  () => h(
                    NButton,
                    {
                      size: "tiny",
                      type: "warning"
                    },
                    () => "Edit"
                  )
                ),
                h(
                  NButton,
                  {
                    size: "tiny",
                    type: "error",
                    onClick: () => destroy(row.id)
                  },
                  () => "Delete"
                )
              ]
            );
          }
        }
        ];
        return {
          installment_data,
          formattedYear,
          formattedMonth,
          formattedBankPanel,
          showProgramView,
          bankOptions,
          IosEye,
          Add12Filled,
          MdSearch,
          MdAddCircleOutline,
          showProgram,
          view,
          testValidation: {
            trigger: 'input',
            // validator(_, value) {
            //   console.log("value >>", value)
            //   return true;
            // }
          },
          dynamicInputRule: {
            trigger: "input",
            // validator(rule, value) {
            //   if (value.length >= 5)
            //     return new Error("Input up to 4 characters");
            //   return true;
            // }
          },
          onCreate() {
            return {
              name: "",
              value: 0,
              payment_date:""
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
          program,
          submitForm,
          destroy,
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
          showPanelBank: ref(false),
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
          clearForm,
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