<template>
	<CardCodeExample ref="card" class="mb-60">
		<n-space vertical :size="12">
            <p class="font-bold text-xl text-black">Update Bank Panel</p>

            <n-card
                :bordered="false"
                size="small"
                role="dialog"                    
                :style="{background: 'white'}"
            >
                <n-scrollbar>
                    <n-form
                        :model="bankPanel"
                        @submit="update"
                        :label-placement="placement"
                        require-mark-placement="right-hanging"
                        label-width="auto"
                    >
                    <!--Holder Name-->
                    <n-grid :cols="5">
                        <n-gi :span="3">
                            <n-form-item label="Holder Name">
                                <n-input v-model:value="bankPanel.holder_name" placeholder="Name"/>
                            </n-form-item>
                        </n-gi>
                    </n-grid>
                    <!--Bank List-->
                    <n-grid :cols="5">
                        <n-gi :span="3">
                            <n-form-item label="Bank Name">
                                <n-select
                                    v-model:show="showBank"
                                    filterable
                                    :options="bankOptions"
                                    v-model:value="bankPanel.bank_id"
                                    placeholder="Select an option"
                                    >
                                    <template v-if="showBank" #arrow>
                                        <md-search />
                                    </template>
                                </n-select>
                            </n-form-item>
                        </n-gi>
                    </n-grid>
                    <!--Account Number-->
                    <n-grid :cols="5">
                        <n-gi :span="3">
                            <n-form-item label="Account Number">
                                <n-input-number v-model:value="bankPanel.account_number" class="w-full" :show-button="false"/>
                            </n-form-item>
                        </n-gi>
                    </n-grid>
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
import { defineComponent, ref, reactive, onBeforeMount, getCurrentInstance } from "vue"
import { NSpace, NButton, NCard, NForm, NFormItem, NInput, NInputNumber, NSelect, NScrollbar, NGrid, NGi } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import axios from 'axios'
import Swal from 'sweetalert2';


export default defineComponent({
  components: {NSpace, NButton, NCard, NForm, NFormItem, NInput, NInputNumber, NScrollbar, NGrid, NGi, NSelect, MdSearch },
    setup() {
        const bankOptions = ref([]);
        const banks = ref([])
        const showBank = ref(false);

        const bankPanel = reactive({
            holder_name: '',
            bank_id: '',
            account_number: 0
        });

        const getBanks = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL + '/api/receipients/banks';
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

        const instance = getCurrentInstance();
        const routeId = instance.proxy.$route.params.id;

        const getBankPanelByID = async (id) => {
            let url = import.meta.env.VITE_BACKEND_URL + `/api/bank-panel/edit/${id}`;
            try {
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                bankPanel.holder_name = response.data.holder_name || null;
                bankPanel.bank_id = response.data.bank_id || null;
                bankPanel.account_number = response.data.account_number || null;
            } catch (error) {
                console.error(error);
            }
        };

        onBeforeMount(() => {
            const instance = getCurrentInstance();
            const routeId = instance.proxy.$route.params.id;
            getBankPanelByID(routeId);
        });

        const back = () =>{
            window.history.back()
        }

        const update = async () => {
          console.log('Form data:', bankPanel);

          try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/api/bank-panel/update/${routeId}}`, bankPanel, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (response.data.code === 200) {
                Swal.fire({
                    width: 380,
                html: '<span class="text-sm">Bank Panel updated successfully.</span>',
                icon: 'success',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#3085d6',
                customClass: {
                    content: 'text-sm',
                    confirmButton: 'px-4 py-2',
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
                    confirmButton: 'px-4 py-2',
                },
                });
                
            } else {
                Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while creating the bank panel.',
                });
            }

          } catch (error) {
            console.error('API error:', error);
          }
        };

        return {
            back,
            showBank,
            bankOptions,
            update,
            bankPanel,
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