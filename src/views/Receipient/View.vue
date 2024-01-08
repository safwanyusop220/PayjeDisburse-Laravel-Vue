<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">PROGRAM LIST</p>
        <n-grid class="px-2" x-gap="" :cols="2">
          <!--Left Data-->
          <n-gi>
            <n-space vertical :size="5">
              <!--Program Name-->
              <n-grid x-gap="space-x-12" :cols="3">
                <n-gi span="1" class="text-sm font-bold">Recipient Name</n-gi>
                <n-gi span="2" class="text-sm">: {{ receipient.name }}</n-gi>
              </n-grid>
              <!--Program Name-->
              <n-grid x-gap="space-x-12" :cols="3">
                <n-gi span="1" class="text-sm font-bold">Identification Number</n-gi>
                <n-gi span="2" class="text-sm">: {{ receipient.identification_number }}</n-gi>
              </n-grid>
              <!--Type of Allocation-->
              <n-grid x-gap="space-x-12" :cols="3">
                <n-gi span="1" class="text-sm font-bold">Address</n-gi>
                <n-gi span="2" class="text-sm">: {{ receipient.address }}</n-gi>
              </n-grid>
              <!--Type of Allocation-->
              <n-grid x-gap="space-x-12" :cols="3">
                <n-gi span="1" class="text-sm font-bold">Postcode</n-gi>
                <n-gi span="2" class="text-sm">: {{ receipient.postcode }}</n-gi>
              </n-grid>
            </n-space>
          </n-gi>
          <!--Right Data-->
          <n-gi>
            <n-space vertical :size="5">
              <!--Frequency Type-->
              <n-grid x-gap="space-x-12" :cols="3">
                <n-gi span="1" class="text-sm font-bold">Phone Number</n-gi>
                <n-gi span="2" class="text-sm">: {{ receipient.phone_number }}</n-gi>
              </n-grid>
              <!--Amount-->
              <n-grid x-gap="space-x-12" :cols="3">
                <n-gi span="1" class="text-sm font-bold">Email Address</n-gi>
                <n-gi span="2" class="text-sm">: {{ receipient.email }}</n-gi>
              </n-grid>
              <!--Amount-->
              <n-grid x-gap="space-x-12" :cols="3">
                <n-gi span="1" class="text-sm font-bold">Bank Name</n-gi>
                <n-gi span="2" class="text-sm">: {{ receipient.bank_name }}</n-gi>
              </n-grid>
              <!--Amount-->
              <n-grid x-gap="space-x-12" :cols="3">
                <n-gi span="1" class="text-sm font-bold">Account Number</n-gi>
                <n-gi span="2" class="text-sm">: {{ receipient.account_number }}</n-gi>
              </n-grid>
            </n-space>
          </n-gi>
        </n-grid>
        <div class="flex justify-between">
          <n-input class="mr-[300px]" v-model:value="searchQuery" placeholder="Search">
            <template #prefix>
              <n-icon :component="MdSearch" />
            </template>
          </n-input>
          <div>
            <n-button  @click="showModal = true" type="success">
              <n-icon :component="Add12Filled" size="17" class="mr-1"/>
              Add
            </n-button>
            <n-modal 
              v-model:show="showModal"
              :mask-closable="true"
              >
              <n-card
                style="width: 700px; margin-top: 50px; margin-bottom: 100px;"
                title="ADD PROGRAM"
                :bordered="false"
                size="huge"
                role="dialog"                    
                :style="{background: 'white'}">
                <n-form
                  :model="recipientProgram"
                  :label-placement="placement"
                  require-mark-placement="right-hanging"
                  label-style="text-lg"
                  label-width="auto">
                  <!--Program-->
                  <n-grid x-gap="" :cols="2">
                    <n-gi>
                      <n-form-item label="Program Name" :label-style="'font-bold'">
                        <n-select
                          v-model:show="showProgram"
                          filterable
                          v-model:value="recipientProgram.program_id"
                          :options="programOptions"
                          placeholder="Select program"
                          @update:value="getProgramID">
                          <template v-if="showProgram" #arrow>
                            <n-icon :component="MdSearch" />
                          </template>
                        </n-select>
                      </n-form-item>
                    </n-gi>
                  </n-grid> 
                  <!--Individual-->
                  <template v-if="showProgramSelected.type == 1">
                    <p class="text-lg font-bold text-black -mt-2 mb-2">Program Details</p>
                    <n-card :hoverable="true" class="shadow-md mb-6">
                      <n-space class="mt-2" vertical :size="15">
                        <!--Program Type-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Program Type</n-gi>
                          <n-gi>{{ showProgramSelected.typeName }}</n-gi>
                        </n-grid>
                        <!--Disburse Amount-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Disburse Amount</n-gi>
                          <n-gi>
                            <n-input-number v-model:value="recipientProgram.disburse_amount" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Amount">
                              <template #prefix>
                                RM
                              </template>
                            </n-input-number>
                          </n-gi>
                        </n-grid>
                        <!--Frequency-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Frequency</n-gi>
                          <n-gi>
                            <n-radio-group v-model:value="recipientProgram.frequency_id">
                              <n-space vertical>
                              <n-radio
                                  v-for="frequency in frequencies"
                                  :key="frequency.value"
                                  :value="frequency.value"
                                  :label="frequency.label"
                                />
                              </n-space>
                            </n-radio-group>
                          </n-gi>
                        </n-grid>
                        <!--One Time-->
                        <template v-if="recipientProgram.frequency_id == 1">
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>Payment Date</n-gi>
                            <n-gi>
                              <n-input
                                v-model:value="recipientProgram.payment_date"
                                type="date"
                                clearable
                                placeholder=" "
                              />
                            </n-gi>
                          </n-grid>
                        </template>
                        <!--Monthly-->
                        <template v-if="recipientProgram.frequency_id == 2">
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>Payment Date</n-gi>
                            <n-gi>
                              <n-input
                                  v-model:value="recipientProgram.payment_date"
                                  type="date"
                                  clearable
                                  placeholder=" "
                                />
                            </n-gi>
                          </n-grid>
                          <!--Total Month-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>Total month</n-gi>
                            <n-gi>
                              <n-input-number v-model:value="recipientProgram.total_month" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Month">
                              </n-input-number>
                            </n-gi>
                          </n-grid>
                          <!--End Date-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>End Date</n-gi>
                            <n-gi>
                              <p class="text-sm text-black ml-2">{{ endMonthDate }}</p>
                            </n-gi>
                          </n-grid>
                        </template>
                        <!--Year-->
                        <template v-if="recipientProgram.frequency_id == 3">
                          <!--Payment Date-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>Payment Date</n-gi>
                            <n-gi>
                              <n-input
                                    v-model:value="recipientProgram.payment_date"
                                    type="date"
                                    clearable
                                    placeholder=" "
                                  />
                            </n-gi>
                          </n-grid>
                          <!--Total Year-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>Total Year</n-gi>
                            <n-gi>
                              <n-input-number v-model:value="recipientProgram.total_year" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Year">
                              </n-input-number>
                            </n-gi>
                          </n-grid>
                          <!--End Date-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>End Date</n-gi>
                            <n-gi>
                              <p class="text-sm text-black ml-2">{{ endYearDate }}</p>
                            </n-gi>
                          </n-grid>
                        </template>
                        <!--Multiple-->
                        <template v-if="recipientProgram.frequency_id == 4">
                          <!--Payment Date-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>Schedular Payment</n-gi>
                            <n-gi>
                              <n-dynamic-input
                                v-model:value="recipientProgram.dynamicInputValue"
                                class=""
                                item-style="margin-bottom: -15px;"
                                :on-create="onCreate"
                                #="{ index, value }">
                                <div>
                                  <n-form-item
                                    ignore-path-change
                                    :show-label="false"
                                    size="medium"
                                    :path="`receipient.dynamicInputValue[${index}].payment_date`"
                                    :rule="testValidation">
                                    <n-input
                                      type="date"
                                      v-model:value="recipientProgram.dynamicInputValue[index].payment_date"
                                      placeholder=""
                                      :clearable="true"
                                      @keydown.enter.prevent
                                    />
                                  </n-form-item>
                                </div>
                              </n-dynamic-input>
                            </n-gi>
                          </n-grid>
                        </template>
                      </n-space>
                    </n-card>
                  </template>
                  <!--Group-->
                  <template v-if="showProgramSelected.type == 2">
                    <p class="font-normal text-md text-black mb-3">Program Details</p>
                    <n-card :hoverable="true" class="shadow-md">
                      <n-space class="mt-2" vertical :size="15">
                        <!--Program Type-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Program Type</n-gi>
                          <n-gi>{{ showProgramSelected.typeName }}</n-gi>
                        </n-grid>
                        <!--Amount Rate-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Amount Rate</n-gi>
                          <n-gi>RM {{ showProgramSelected.disburse_amount }}</n-gi>
                        </n-grid>
                        <!--Frequency-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Frequency</n-gi>
                          <n-gi>{{ showProgramSelected.frequency }}</n-gi>
                        </n-grid>
                        <!--Start Date-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Date Payment</n-gi>
                          <n-gi>{{ showProgramSelected.payment_date }}</n-gi>
                        </n-grid>
                        <template v-if="showProgramSelected.frequency_id != 1">
                        
                          <template v-if="showProgramSelected.frequency_id == 2">
                            <!--Total Month-->
                            <n-grid x-gap="space-x-12" :cols="2">
                              <n-gi>Total Month</n-gi>
                              <n-gi>{{ showProgramSelected.total_month }}</n-gi>
                            </n-grid>
                          </template>
                          <template v-if="showProgramSelected.frequency_id == 3">
                            <!--Total Month-->
                            <n-grid x-gap="space-x-12" :cols="2">
                              <n-gi>Total Year</n-gi>
                              <n-gi>{{ showProgramSelected.total_year }}</n-gi>
                            </n-grid>
                          </template>
                            <!--End Date-->
                            <n-grid x-gap="space-x-12" :cols="2">
                              <n-gi>End Date</n-gi>
                              <n-gi>test</n-gi>
                            </n-grid>
                        </template>
                        
                      </n-space>
                    </n-card>
                  </template>
                  <!--Schedule-->
                  <template v-if="showProgramSelected.type == 3">
                    <p class="font-normal text-md text-black mb-3">Program Details</p>
                    <n-card :hoverable="true" class="shadow-md">
                      <n-space class="mt-2" vertical :size="15">
                        <!--Program Type-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Program Type</n-gi>
                          <n-gi>{{ showProgramSelected.typeName }}</n-gi>
                        </n-grid>
                        <!--Amount Rate-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Amount Rate</n-gi>
                          <n-gi>RM {{ showProgramSelected.disburse_amount }}</n-gi>
                        </n-grid>
                        <p class="text-black mb-2">Payment Date</p>
                      </n-space>
                        <!--Payment Date-->
                        <template v-for="(installment_program, index) in showProgramSelected.installment_programs" :key="index">
                          <n-grid class="ml-5 mb-1" :cols="2">
                              <n-gi>
                                {{ formatDate(installment_program.payment_date) }}
                              </n-gi>
                              <n-gi class="-ml-5">
                                RM {{ installment_program.amount }}
                              </n-gi>
                          </n-grid>
                      </template>
                    </n-card>
                  </template>
                  <!--Batch-->
                  <template v-if="showProgramSelected.type == 4">
                    <p class="font-normal text-md text-black mb-3">Program Details</p>
                    <n-card :hoverable="true" class="shadow-md">
                      <n-space class="mt-2" vertical :size="25">
                        <!--Program Type-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Program Type</n-gi>
                          <n-gi>{{ showProgramSelected.typeName }}</n-gi>
                        </n-grid>
                        <!--Amount Rate-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Amount Rate</n-gi>
                          <n-gi>RM {{ showProgramSelected.disburse_amount }}</n-gi>
                        </n-grid>
                        <p class="text-black mb-2">Payment Date</p>
                      </n-space>
                      <!--Payment Date-->
                      <template v-for="(installment_program, index) in showProgramSelected.installment_programs" :key="index">
                        <n-grid class="ml-5 mb-1" :cols="2">
                            <n-gi>
                              {{ installment_program.name }}
                            </n-gi>
                            <n-gi>
                              {{ formatDate(installment_program.payment_date) }}
                            </n-gi>
                        </n-grid>
                      </template>
                    </n-card>
                  </template>
                  <div class="flex justify-end mt-5">
                    <n-button @click="submitForm" type="primary">
                      Submit
                    </n-button>
                  </div>
                </n-form>
              </n-card>
            </n-modal>
          </div>
        </div>
        <n-data-table ref="dataTableInst" :columns="columns" :data="filteredRecipientPrograms" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h, onBeforeMount, getCurrentInstance, computed, watch } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NRadio, NSelect, NInputNumber, NRadioGroup, NGrid, NGi, NDynamicInput, NIcon } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";
import { format } from 'date-fns';
import IosEye from "@vicons/ionicons4/IosEye";
import NotepadEdit16Filled from "@vicons/fluent/NotepadEdit16Filled";
import Delete24Filled from "@vicons/fluent/Delete24Filled";
import Swal from 'sweetalert2';
import { useAuthStore } from "@/stores/auth"
import dayjs from 'dayjs';

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
  components: { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NRadio, NSelect, NInputNumber, NRadioGroup, NGrid, NGi, NDynamicInput, NIcon},
    setup() {
      const userId = localStorage.getItem('userId');

      const programs = ref([])
      const banks = ref([])
      const programOptions = ref([]);
      const bankOptions = ref([]);

      const receipient = reactive({
        name: '',
        identification_number: '',
        address: '',
        postcode: '',
        phone_number: '',
        email: '',
        bank_id: '',
        account_number: '',
        program_id: '',
        frequency_id: '',
        payment_date: '',
        type_id: '',
        dynamicInputValue: [],
        program_type_id: '',
        disburse_amount: 0,
        total_month: 0,
        total_year: 0,
        end_date: '',
        program_type:'',

        program_typeName: '',
        program_disburse_amount: '',
        program_payment_date: '',
        program_frequency_id:'',
        program_frequency_name:'',
        program_total_month:'',
        program_total_year:'',
        program_end_date:''
      });

      const showProgramSelected = reactive({
          name: '',
          type: '',
          disburse_amount: '',
          frequency_id: '',
          frequency: '',
          payment_date: '',
          total_month: '',
          total_year: '',
      });
      const recipientPrograms = ref([])
      const recipientProgram = ref({
        recipient_id: '',
        program_id: '',
        created_by_id: userId,
      });

      const isAllowed = (permission) => {
        return useAuthStore().isAllowed(permission);
      };

      const instance = getCurrentInstance();
      const routeId = instance.proxy.$route.params.id;
      recipientProgram.value.recipient_id = Number(routeId);

      onBeforeMount(() => {
          const instance = getCurrentInstance();
          const routeId = instance.proxy.$route.params.id;
          getRecipientByID(routeId);
          getProgramByID(routeId);
      });

      const endMonthDate = computed (() => {
        if (recipientProgram.value.payment_date && recipientProgram.value.total_month) {
          return dayjs(recipientProgram.value.payment_date, 'YYYY-MM-DD').add(recipientProgram.value.total_month, 'month').format('DD/MM/YYYY');
        }
        return '';
      });
      
      const endYearDate = computed(() => {
        if (recipientProgram.value.payment_date && recipientProgram.value.total_year) {
          return dayjs(recipientProgram.value.payment_date, 'YYYY-MM-DD').add(recipientProgram.value.total_year, 'year').format('DD/MM/YYYY');
        }
        return '';
      });

      if(endMonthDate.value != null){
        watch(endMonthDate, (newValue) => {
          recipientProgram.value.end_date = newValue;
        });
      }if(endYearDate.value != null)
      {
        watch(endYearDate, (newValue) => {
          recipientProgram.value.end_date = newValue;
        });
      }

      const searchQuery = ref('');
        const filteredRecipientPrograms = computed(() => {
          const lowerSearchQuery = searchQuery.value.toLowerCase();
          return recipientPrograms.value.filter(recipientProgram => 
            recipientProgram.program.code.toLowerCase().includes(lowerSearchQuery) ||
            recipientProgram.program.name.toLowerCase().includes(lowerSearchQuery) ||
            recipientProgram.program.type.name.toLowerCase().includes(lowerSearchQuery) ||
            recipientProgram.status.name.toLowerCase().includes(lowerSearchQuery)  
          );
        });

      const formatDate = (date) => {
        return date ? format(new Date(date), 'dd/MM/yyyy') : null;
      };

      const getRecipientByID = async (id) => {
          let url = import.meta.env.VITE_BACKEND_URL + `/api/recipient-program/recipient/${id}`;
          try {
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });

            console.log('data', response)

            recipientPrograms.value = response.data.recipient_program.map(recipientProgram => {
              const createdAtDate = new Date(recipientProgram.created_at);
              const formattedDate = formatDate(createdAtDate.toISOString().split('T')[0]);

              return {
                ...recipientProgram,
                createdDate: formattedDate
              };
            });

            receipient.name = response.data.name || null;
            receipient.identification_number = response.data.identification_number || null;
            receipient.address = response.data.address || null;
            receipient.postcode = response.data.postcode || null;
            receipient.phone_number = response.data.phone_number || null;
            receipient.email = response.data.email || null;
            receipient.bank_id = response.data.bank_id || null;
            receipient.account_number = response.data.account_number || null;
            receipient.program_id = response.data.program_id || null;
            receipient.bank_name = response.data.bank.name || null;
            
            if(response.data && response.data.program)
            {
              receipient.program_typeName = response.data.program.type.name || null;
              receipient.program_disburse_amount = response.data.program.disburse_amount || null;
              receipient.program_payment_date = response.data.program.payment_date || null;
              receipient.program_total_month = response.data.program.total_month || null;
              receipient.program_total_year = response.data.program.total_year || null;
              receipient.program_end_date = response.data.program.end_date || null;

              if(response.data && response.data.program.frequency)
              {
                receipient.program_frequency_id = response.data.program.frequency.id || null;
                receipient.program_frequency_name = response.data.program.frequency.name || null;
              }
            }

          } catch (error) {
              console.error(error);
          }
      };  

      const getProgramByID = async (id) => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +`/api/recipient-program/programs/${id}`;
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            programs.value = response.data.programs;

            programOptions.value = response.data.programs.map(program => ({
                label: program.name,
                value: program.id,
            }));
        } catch (error) {
            console.error(error);
        }
      };
      getProgramByID()

      const getProgramID = async (id) => {
          let url = import.meta.env.VITE_BACKEND_URL +`/api/receipients/program/show/${id}`;

          try {
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            // console.log(response);

            const programData = response.data.program;

            console.log(programData);

            showProgramSelected.name = programData.name
            showProgramSelected.type = programData.type.id
            showProgramSelected.typeName = programData.type.name
            showProgramSelected.name = programData.name
            showProgramSelected.disburse_amount = programData.disburse_amount

            showProgramSelected.payment_date = programData.payment_date
            showProgramSelected.total_month = programData.total_month
            showProgramSelected.total_year = programData.total_year

            showProgramSelected.installment_programs = programData.installment_programs

            try {
              if (programData && programData.frequency) {
                showProgramSelected.frequency_id = programData.frequency.id;
                showProgramSelected.frequency = programData.frequency.name;
              } else {
                // console.warn('Frequency data is not available.');
              }

              } catch (innerError) {
                console.error('Error handling frequency data:', innerError);
            }

          } catch (error) {
            console.error("Error fetching program data:", error);
          }
        };

      const submitForm = async () => {
        console.log('Form data:', recipientProgram.value);

        try {
          const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/recipient-program/store',
            recipientProgram.value,
            {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            }
          );
          console.log('API response:', response.data);

          if (response.data.code === 200) {
            Swal.fire({
              width: 380,
              html: '<span class="text-sm">Recipient program created successfully.</span>',
              icon: 'success',
              confirmButtonText: 'Okay',
              confirmButtonColor: '#0095e8',
              customClass: {
                content: 'text-sm',
                confirmButton: 'px-4 py-2 text-white',
              },
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
            showModalRef.value = false;
          } else if(response.data.code === 400) {
            for (const field in response.data.messages) {
              recipientProgram.value.errors[field] = response.data.messages[field][0];
            }
            showModalRef.value = true;
          }
        } catch (error) {
          console.error('API error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred while creating the bank panel.',
          });
        }
      };

      const bankPanels = ref([])
      const showModalRef = ref(false);

      const getBankPanels = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/bank-panel'
            const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            bankPanels.value = response.data.bankPanels.map(panel => {
              // Convert created_at to a Date object
              const createdAtDate = new Date(panel.created_at);
              const formattedDate = createdAtDate.toISOString().split('T')[0];

              return {
                ...panel,
                createdDate: formattedDate
              };
            });
            console.log(bankPanels.value)
        } catch (error) {
            console.error(error)
        }
      }
      getBankPanels()

      const getRecipientProgram = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/bank-panel'
            const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            bankPanels.value = response.data.bankPanels.map(panel => {
              // Convert created_at to a Date object
              const createdAtDate = new Date(panel.created_at);
              const formattedDate = createdAtDate.toISOString().split('T')[0];

              return {
                ...panel,
                createdDate: formattedDate
              };
            });
            console.log(bankPanels.value)
        } catch (error) {
            console.error(error)
        }
      }
      getRecipientProgram()

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
        //program Code
        {
          title: "Program Code",
          key: "program.code",
          resizable: true,
          minWidth: 140,
        },
        //program Name
        {
          title: "Program Name",
          key: "program.name",
          resizable: true,
          minWidth: 130,
        },
        //program type
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
              return row.program.type.id === parseInt(value, 10);
          }
        },
        //status
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
              return row.status.id === parseInt(value, 10);
          }
        },
        // // Action
        // {
        //   title: "Action",
        //   key: "id",	 
        //   align: "center",
        //   width: 120,
        //   render(row) {
        //     return h(
        //       "div",
        //       { class: "space-x-1" },
        //       [
        //       h(
        //         RouterLink,
        //           {
        //             to: {
        //               name: 'Receipient-View',
        //               params: { id: row.id } 
        //             }
        //           },
        //           () => h(
        //             NIcon,
        //             {
        //               size: "large",
        //               // onClick: () => view(row.id),
        //               class: "cursor-pointer text-blue-500 hover:text-blue-700"
        //             },
        //           () => h(IosEye)
        //           )
        //         ),
        //         isAllowed('update_recipient') 
        //           ? h(
        //               RouterLink,
        //               {
        //                 to: {
        //                   name: 'Receipient-Edit',
        //                   params: { id: row.id } 
        //                 }
        //               },
        //               () => h(
        //                 NIcon,
        //                 {
        //                   size: "large",
        //                   type: "warning",
        //                   class: "cursor-pointer text-yellow-500 hover:text-yellow-600"
        //                 },
        //                 () => h(NotepadEdit16Filled)
        //               )
        //             ):null,
        //         isAllowed('delete_recipient') ?
        //         h(
        //           NIcon,
        //           {
        //             size: "large",
        //             type: "error",
        //             onClick: () => destroy(row.id),
        //             class: "cursor-pointer text-red-500 hover:text-red-600"
        //           },
        //           () => h(Delete24Filled)
        //         ):null,
        //       ]
        //     );
        //   }
        // }
        ];
      return {
        filteredRecipientPrograms,
        searchQuery,
        recipientPrograms,
        recipientProgram,
        submitForm,
        endYearDate,
        endMonthDate,
        formatDate,
        showProgramSelected,
        getProgramID,
        showProgram: ref(false),
        programOptions,
        receipient,
        placement: ref("top"),
        showModal: showModalRef,
        MdSearch,
        Add12Filled,
        dataTableInst: dataTableInstRef,
        columns,
        bankPanels,
        pagination,
        onCreate() {
            return {
              payment_date:""
            };
          },
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