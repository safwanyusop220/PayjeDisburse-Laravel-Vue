<template>
	<CardCodeExample ref="card">
        <p class="font-bold text-xl text-black mb-4">UPDATE RECIPIENT</p>

        <n-form
          :model="receipient"
          @submit="update"
          :label-placement="placement"
          :label-align="align"
          require-mark-placement="right-hanging"
          label-width="auto">
          <n-scrollbar style="max-height: 400px; padding: 15px">
            <n-grid x-gap="" :cols="2">
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
                    :options="programOptions"
                    placeholder="Select an option"
                    @update:value="getProgramID"
                    >
                      <template v-if="showProgram" #arrow>
                          <md-search />
                      </template>
                  </n-select>
                </n-form-item>
              </n-gi>
              <!--Right Data-->
              <n-gi class="ml-16">
                <!--Individual-->
                <template v-if="showProgramSelected.type == 1">
                  <!-- <input type="number" v-model="receipient.program_type_id"/> -->
                  <n-form-item>
                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                  </n-form-item>
                  <n-card :hoverable="true" class="shadow-sm">
                    <!--Program Type-->
                    <n-grid x-gap="" :cols="1">
                      <n-gi>
                        <n-form-item label="Program Type">
                          {{ showProgramSelected.typeName }}
                        </n-form-item>
                      </n-gi>
                    </n-grid>
                    <!--Disburse Amount-->
                    <n-grid x-gap="" :cols="1">
                      <n-gi>
                        <n-form-item label="Disburse Amount">
                          <n-input-number v-model:value="receipient.disburse_amount" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Amount">
                            <template #prefix>
                              RM
                            </template>
                          </n-input-number>
                        </n-form-item>
                      </n-gi>
                    </n-grid>
                    <!--Frequency-->
                    <n-grid x-gap="" :cols="1">
                      <n-gi>
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
                      </n-gi>
                    </n-grid>

                    <!--One Time-->
                    <template v-if="receipient.frequency_id == 1">
                      <!--Payment Date-->
                      <n-grid x-gap="" :cols="1">
                        <n-gi>
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
                    </template>
                    
                    <template v-if="receipient.frequency_id == 2">
                      <!--Payment Date-->
                      <n-grid x-gap="" :cols="1">
                        <n-gi>
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

                      <!--Total Month-->
                      <n-grid x-gap="" :cols="1">
                        <n-gi>
                          <n-form-item label="Total Month">
                            <n-input-number v-model:value="receipient.total_month" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Month">
                            </n-input-number>
                          </n-form-item>
                        </n-gi>
                      </n-grid>

                      <!--End date-->
                      <n-grid x-gap="" :cols="1">
                        <n-gi>
                          <n-form-item label="End Date">
                            {{ endMonthDate }}
                          </n-form-item>
                        </n-gi>
                      </n-grid>
                    </template>
                    <!--Year-->
                    <template v-if="receipient.frequency_id == 3">
                      <!--Payment Date-->
                      <n-grid x-gap="" :cols="1">
                        <n-gi>
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
                      <!--Total Year-->
                      <n-grid x-gap="" :cols="1">
                        <n-gi>
                          <n-form-item label="Total Year">
                            <n-input-number v-model:value="receipient.total_year" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Year">
                            </n-input-number>
                          </n-form-item>
                        </n-gi>
                      </n-grid>
                      <!--End date-->
                      <n-grid x-gap="" :cols="1">
                        <n-gi>
                          <n-form-item label="End Date">
                            {{ endYearDate }}
                          </n-form-item>
                        </n-gi>
                      </n-grid>
                    </template>
                    <!--Multiple-->
                    <template v-if="receipient.frequency_id == 4">
                      <p class="mb-3 text-black text-sm">Schedular Payment</p>
                      <n-dynamic-input
                        v-model:value="receipient.dynamicInputValue"
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
                              v-model:value="receipient.dynamicInputValue[index].payment_date"
                              placeholder=""
                              :clearable="true"
                              @keydown.enter.prevent
                            />
                          </n-form-item>
                        </div>
                      </n-dynamic-input>
                    </template>
                  </n-card>
                </template>
                <!--Group-->
                <template v-if="showProgramSelected.type == 2 || receipient.program_type == 2">
                  <n-form-item>
                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                  </n-form-item>
                  <n-card :hoverable="true" class="shadow-md">
                    <n-space class="mt-2" vertical :size="25">
                      <!--Program Type-->
                      <n-grid x-gap="space-x-12" :cols="2">
                        <n-gi>Program Type</n-gi>
                        <n-gi>{{ showProgramSelected.typeName ||  receipient.program_typeName }}</n-gi>
                      </n-grid>
                      <!--Amount Rate-->
                      <n-grid x-gap="space-x-12" :cols="2">
                        <n-gi>Amount Rate</n-gi>
                        <n-gi>RM {{ showProgramSelected.disburse_amount || receipient.program_disburse_amount }}</n-gi>
                      </n-grid>
                      <!--Frequency-->
                      <n-grid x-gap="space-x-12" :cols="2">
                        <n-gi>Frequency</n-gi>
                        <n-gi>{{ showProgramSelected.frequency || receipient.program_frequency_name }}</n-gi>
                      </n-grid>
                      <!--Start Date-->
                      <n-grid x-gap="space-x-12" :cols="2">
                        <n-gi>Date Payment</n-gi>
                        <n-gi>{{ showProgramSelected.payment_date || receipient.program_payment_date }}</n-gi>
                      </n-grid>
                      <template v-if="showProgramSelected.frequency_id != 1 || receipient.program_frequency_id != 1">
                        <template v-if="showProgramSelected.frequency_id == 2 || receipient.program_frequency_id == 2">
                          <!--Total Month-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>Total Month</n-gi>
                            <n-gi>{{ showProgramSelected.total_month || receipient.program_total_month  }}</n-gi>
                          </n-grid>
                        </template>
                        <template v-if="showProgramSelected.frequency_id == 3 || receipient.program_frequency_id == 3">
                          <!--Total Month-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>Total Year</n-gi>
                            <n-gi>{{ showProgramSelected.total_year || receipient.program_total_year }}</n-gi>
                          </n-grid>
                        </template>
                          <!--End Date-->
                          <n-grid x-gap="space-x-12" :cols="2">
                            <n-gi>End Date</n-gi>
                            <n-gi>{{ receipient.program_end_date }}</n-gi>
                          </n-grid>
                      </template>
                      
                    </n-space>
                  </n-card>
                </template>
                <!--Schedule-->
                <template v-if="showProgramSelected.type == 3">
                    <n-form-item>
                      <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                    </n-form-item>
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
                  <n-form-item>
                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                  </n-form-item>
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
              </n-gi>
            </n-grid>
          </n-scrollbar>
            <div class="flex justify-end">
              <n-button @click="update" type="primary">
                <template #icon>
                  <n-icon>
                      <Repeat/>
                  </n-icon>
                </template>
                Update
              </n-button>
            </div>
      </n-form>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h, onBeforeMount, getCurrentInstance } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NCard, NButton, NForm, NFormItem, NInput, NInputNumber, NSelect, NRadio, NRadioGroup,NDynamicInput, NGrid, NGi, NScrollbar, NIcon } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import { Repeat } from '@vicons/ionicons5'
import Swal from 'sweetalert2';
import { format } from 'date-fns';


export default defineComponent({
  components: {  NSpace, NCard, NButton, NForm, NFormItem, NInput, NInputNumber, NSelect, NRadio, NRadioGroup,NDynamicInput, NGrid, NGi, MdSearch, NScrollbar, Repeat, NIcon },
    setup() {
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

      const instance = getCurrentInstance();
      const routeId = instance.proxy.$route.params.id;

      const formatDate = (date) => {
          return date ? format(new Date(date), 'dd/MM/yyyy') : null;
        };

      const getRecipientByID = async (id) => {
          let url = import.meta.env.VITE_BACKEND_URL + `/api/receipients/edit/${id}`;
          try {
              const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
              console.log('data', response)
              receipient.name = response.data.name || null;
              receipient.identification_number = response.data.identification_number || null;
              receipient.address = response.data.address || null;
              receipient.postcode = response.data.postcode || null;
              receipient.phone_number = response.data.phone_number || null;
              receipient.email = response.data.email || null;
              receipient.bank_id = response.data.bank_id || null;
              receipient.account_number = response.data.account_number || null;
              receipient.program_id = response.data.program_id || null;

              receipient.program_type = response.data.program.type_id || null;
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

      onBeforeMount(() => {
          const instance = getCurrentInstance();
          const routeId = instance.proxy.$route.params.id;
          getRecipientByID(routeId);
      });

      const update = async () => {
          console.log('Form data:', receipient);

          try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/api/receipients/update/${routeId}}`, receipient, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            Swal.fire({
                  width: 380,
                  html: '<span class="text-sm">Recipient has updated successfully.</span>',
                  icon: 'success',
                  confirmButtonText: 'Okay',
                  confirmButtonColor: '#3085d6',
                  customClass: {
                      content: 'text-sm',
                      confirmButton: 'px-4 py-2 text-white',
                  },
              }).then((result) => {
                  if (result.isConfirmed) {
                    window.history.back();
                  }
              });
          } catch (error) {
              console.error('API error:', error.response.data);
              const errorMessage = Object.values(error.response.data.message).join('<br>');
              Swal.fire({
                width: 400,
                html: `<span class="text-sm">${errorMessage}</span>`,
                icon: 'error',
                confirmButtonText: 'Okay',
                customClass: {
                    content: 'text-sm',
                    confirmButton: 'px-4 py-2 text-white text-xs rounded bg-blue-500',
                },
              })
          }
        };

      const getPrograms = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/receipients/programs';
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            programs.value = response.data.programs;

            programOptions.value = response.data.programs.map(program => ({
                label: program.name,
                value: program.id,
            }));

            // console.log(programs.value);
            // console.log(programOptions.value);
        } catch (error) {
            console.error(error);
        }
      };
      getPrograms()

      const getBanks = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL +'/api/receipients/banks';
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                banks.value = response.data.banks;

                bankOptions.value = response.data.banks.map(bank => ({
                    label: bank.name,
                    value: bank.id
                }));

                // console.log(banks.value);
                // console.log(bankOptions.value);
            } catch (error) {
                console.error(error);
            }
      };
      getBanks()

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



      return {
        formatDate,
        showProgramSelected,
        getProgramID,
        showBank: ref(false),
        bankOptions,
        showProgram: ref(false),
        programOptions,
        receipient,
        update,
        align: ref("left"),
        placement: ref("left"),
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