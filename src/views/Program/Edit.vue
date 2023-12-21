<template>
	<CardCodeExample ref="card" class="mb-60">
		<n-space vertical :size="12">
            <p class="font-bold text-xl text-black">Update Program</p>

            <n-card
                :bordered="false"
                size="small"
                role="dialog"                    
                :style="{background: 'white'}"
            >
                <n-scrollbar>
                    <n-form
                        :model="program"
                        @submit="update"
                        :label-placement="placement"
                        require-mark-placement="right-hanging"
                        label-width="auto"
                    >
                    <!--Program Name/Code-->
                    <n-grid x-gap="20" :cols="2">
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
                                v-model:show="show2"
                                filterable
                                v-model:value="program.bank_panel"
                                :options="options"
                                placeholder="Select an option"
                                >
                                    <template v-if="show2" #arrow>
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
                            <n-grid x-gap="" :cols="2">
                                <n-gi>
                                <n-form-item label="Total Month">
                                    <n-input-number class="w-full" v-model:value="program.total_month" :show-button="false"/>
                                </n-form-item>
                                </n-gi>
                            </n-grid>
                            <!--End date-->
                            <n-grid x-gap="" :cols="2">
                              <n-gi>
                                <n-form-item label="End Date">
                                  {{ endMonthDate }}
                                </n-form-item>
                              </n-gi>
                            </n-grid>
                        </template>
                        <template v-if="program.frequency_id == 3">
                            <!--Total Month-->
                            <n-grid x-gap="" :cols="2">
                                <n-gi>
                                <n-form-item label="Total Year">
                                    <n-input-number class="w-full" v-model:value="program.total_year" :show-button="false"/>
                                </n-form-item>
                                </n-gi>
                            </n-grid>
                            <!--End date-->
                            <n-grid x-gap="" :cols="2">
                              <n-gi>
                                <n-form-item label="End Date">
                                  {{ endYearDate }}
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
                                <n-form-item label="Installment Program">
                                    <n-dynamic-input
                                        v-model:value="program.installment_programs"
                                        class="w-full"
                                        item-style="margin-bottom: -15px;"
                                        :on-create="onCreate"
                                        #="{ index, value }">
                                        <div style="display: flex">
                                            <n-form-item
                                                ignore-path-change
                                                :show-label="false"
                                                size="medium"
                                                :path="`installment_programs[${index}].value`"
                                                >
                                                <n-input-number
                                                v-model:value="program.installment_programs[index].amount"
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
                                            :path="`installment_programs[${index}].name`"
                                        >
                                            <n-input
                                            type="date"
                                            v-model:value="program.installment_programs[index].payment_date"
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
                                    v-model:value="program.installment_programs"
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
                                        :path="`dynamicInputValue[${index}].value`"
                                    >
                                    <n-input
                                        v-model:value="program.installment_programs[index].name"
                                        placeholder="Title" @keydown.enter.prevent
                                        class="w-full"/>
                                    </n-form-item>
                                    <div style="height: 34px; line-height: 34px; margin: 0 8px">
                                    </div>
                                    <n-form-item
                                        ignore-path-change
                                        :show-label="false"
                                        size="medium"
                                        :path="`dynamicInputValue[${index}].name`"
                                    >
                                        <n-input
                                        type="date"
                                        v-model:value="program.installment_programs[index].payment_date"
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
                    <div class="flex justify-end space-x-2">
                        <n-button @click="back" type="info" style="width: 80px;">Back</n-button>

                        <n-button @click="update" style="width: 80px;" type="primary">Update</n-button>
                    </div>
                    </n-form>
                </n-scrollbar>
            </n-card>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, onBeforeMount, getCurrentInstance, computed, watch } from "vue"
import { NSpace, NButton, NCard, NForm, NFormItem, NInput, NRadio, NSelect, NInputNumber, NScrollbar, NRadioGroup, NGrid, NGi, NDynamicInput   } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import axios from 'axios'
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

export default defineComponent({
  components: {NSpace, NButton, NCard, NForm, NFormItem, NInput, NRadio, NScrollbar, NRadioGroup, NGrid, NGi, NSelect, MdSearch, NInputNumber, NDynamicInput},
    setup() {
        const program = reactive({
            id: '',
            name: '',
            code: '',
            disburse_amount:0,
            type_id: '',
            bank_panel: '',
            frequency_id: '',
            payment_date: '',
            total_month: 0,
            total_year: 0,
            installment_programs: [],
        });

        const instance = getCurrentInstance();
        const routeId = instance.proxy.$route.params.id;

        const endMonthDate = computed (() => {
          if (program.payment_date && program.total_month) {
            return dayjs(program.payment_date, 'YYYY-MM-DD').add(program.total_month, 'month').format('DD/MM/YYYY');
          }
          return '';
        });

        const endYearDate = computed (() => {
          if (program.payment_date && program.total_year) {
            return dayjs(program.payment_date, 'YYYY-MM-DD').add(program.total_year, 'year').format('DD/MM/YYYY');
          }
          return '';
        });

        if(endMonthDate.value != null){
          watch(endMonthDate, (newValue) => {
            program.end_date = newValue;
          });
        }if(endYearDate.value != null)
        {
          watch(endYearDate, (newValue) => {
            program.end_date = newValue;
          });
        }

        const getProgramById = async (id) => {
            let url =import.meta.env.VITE_BACKEND_URL +`/api/programs/edit/${id}`;
            try {
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                console.log(response);
                const programData = response.data;

                program.name = programData.name || null;
                program.code = programData.code || null;
                program.type_id = programData.type_id || null;
                program.bank_panel = programData.bank_panel || null;
                program.disburse_amount = programData.disburse_amount || null;
                program.frequency_id = programData.frequency_id || null;
                program.payment_date = programData.payment_date || null;
                program.total_month = programData.total_month || null;
                program.total_year = programData.total_year || null;

                try {
                    if (programData && programData.installment_programs) {
                        program.installment_programs = programData.installment_programs  || null;
                    }else {
                    console.log('Frequency data is not available.');
                    }
                    } catch (innerError) {
                        console.error('Error handling frequency data:', innerError);
                }

            } catch (error) {
                console.error(error);
            }
        };

        onBeforeMount(() => {
            const instance = getCurrentInstance();
            const routeId = instance.proxy.$route.params.id;
            getProgramById(routeId);
        });

        const back = () =>{
            window.history.back()
        }

        const update = async () => {
          console.log('Form data:', program);
          try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL +`/api/programs/update/${routeId}}`, program, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            console.log('API response:', response.data);
            if (response.data.code === 200) {
                Swal.fire({
                  width: 380,
                  html: '<span class="text-sm">Program has been updated successfully.</span>',
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
              } else if (response.data.code === 400) {
                const errorMessage = Object.values(response.data.messages).join('<br>');
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
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'An error occurred while creating the user.',
                });
              }
          } catch (error) {
            console.error('API error:', error);
          }
        };

        return {
            endYearDate,
            endMonthDate,
            back,
            update,
            program,
            onCreate() {
                return {
                name: "",
                value: 0
                };
            },
            programTypes: [
                {
                value: 1,
                label: "Individual"
                },
                {
                value: 2,
                label: "Group"
                },
                {
                value: 3,
                label: "Schedule"
                },
                {
                value: 4,
                label: "Batch"
                }
            ],
            frequencies: [
                {
                value: 1,
                label: "One Time"
                },
                {
                value: 2,
                label: "Monthly"
                },
                {
                value: 3,
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
            placement: ref("left"),
            show2: ref(false),
            options: [
                {
                value: 1,
                label: "Maybank"
                },
                {
                value: 2,
                label: "Public Bank"
                },
                {
                value: 3,
                label: "Cimb Bank"
                }
            ],
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