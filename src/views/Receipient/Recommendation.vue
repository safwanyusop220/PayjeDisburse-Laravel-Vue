<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
			<p class="font-bold text-xl text-black">Recommendation</p>
			<div class="flex justify-between space-x-10">
                <n-input class="mr-[100px]" v-model:value="searchQuery" placeholder="Search">
					<template #prefix>
						<n-icon :component="MdSearch" />
					</template>
				</n-input>
				<div class="flex space-x-3">
					<template v-if="checkedRowKeys.length > 0">
						<n-button @click="showReject = true" type="error" style="width: 125px; font-size: 12px;">
							Reject 
							<p class="bg-white text-red-600 ml-1.5 text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{{ checkedRowKeys.length }}
							</p>
						</n-button>
					</template>
					<template v-if="checkedRowKeys.length == 0">
						<n-button  type="error" style="width: 125px; font-size: 12px;">
							Reject 
						</n-button>
					</template>
					<template  v-if="checkedRowKeys.length > 0">
						<n-button @click="showEndorse = true" type="success" style="width: 125px; font-size: 12px;">
							Recommend
							<p class="bg-white text-green-600 ml-1.5 text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{{ checkedRowKeys.length }}
							</p>					
						</n-button>
					</template>
					<template v-if="checkedRowKeys.length == 0">
						<n-button  type="success" style="width: 125px; font-size: 12px;">
							Recommend				
						</n-button>
					</template>
				</div>
                <!--Show Endorse-->
                <n-modal
                    v-model:show="showEndorse"
                    :mask-closable="false"
                    preset="dialog"
                    icon-placement="top"
                    content="Are you sure to endorse this program?"
                    positive-text="Confirm"
                    negative-text="Cancel"
                    @positive-click="bulkConfirmApprove"
                    @negative-click="bulkCancelApprove"
                />
                <!--Show Reject-->
                <n-modal
                    v-model:show="showReject"
                    :mask-closable="false"
                    preset="dialog"
                    type="error"
                    icon-placement="top"
                    content="Are you sure to reject this program?"
                    positive-text="Confirm"
                    negative-text="Cancel"
                    @positive-click="bulkConfirmReject"
                    @negative-click="bulkCancelReject"
                />
			</div>
			<n-data-table ref="dataTableInst" :columns="columns" :data="filteredRecommendations" :pagination="pagination"
				:row-key="rowKey"
				:max-height="400"
				@update:checked-row-keys="handleCheck"
			/>
            <n-modal
			v-model:show="showReceipient"
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
                        :model="showReceipientView"
                        :label-placement="placement"
                        :label-align="align"
                        require-mark-placement="right-hanging"
                        label-width="auto"
                    >
                        <n-grid x-gap="" :cols="2">
                            <!--Left Data-->
                            <n-gi>
                                <!--Title-->
                                <n-form-item>
                                <label class="text-xl font-bold text-gray-600 -mb-8">Receipient Details</label>
                                </n-form-item>
                                <!--Name-->
                                <n-form-item label="Receipient Name">
                                <n-input v-model:value="showReceipientView.name" disabled/>
                                </n-form-item>
                                <!--Identification-->
                                <n-form-item label="Identification Number">
                                <n-input v-model:value="showReceipientView.identification_number" disabled/>
                                </n-form-item>
                                <!--Address-->
                                <n-form-item label="Receipient Address">
                                <n-input v-model:value="showReceipientView.address" type="textarea" disabled/>
                                </n-form-item>
                                <!--Postcode-->
                                <n-form-item label="Postcode Number">
                                <n-input v-model:value="showReceipientView.postcode" disabled/>
                                </n-form-item>
                                <!--Phone-->
                                <n-form-item label="Phone Number">
                                <n-input v-model:value="showReceipientView.phone_number" disabled/>
                                </n-form-item>
                                <!--Email-->
                                <n-form-item label="Email Address">
                                <n-input v-model:value="showReceipientView.email" disabled/>
                                </n-form-item>
                                <!--Bank-->
                                <n-form-item label="Bank Name">
                                <n-select
                                    v-model:show="showBank"
                                    filterable
                                    v-model:value="showReceipientView.bank_id"
                                    :options="bankOptions"
                                    placeholder="Select an option"
                                    disabled
                                    >
                                    <template v-if="showBank" #arrow>
                                        <md-search />
                                    </template>
                                </n-select>
                                </n-form-item>
                                <!--Account Number-->
                                <n-form-item label="Account Number">
                                <n-input v-model:value="showReceipientView.account_number" disabled/>
                                </n-form-item>
                                <!--Program-->
                                <n-form-item label="Program Name">
                                <n-select
                                    v-model:show="showProgram"
                                    filterable
                                    v-model:value="showReceipientView.program_id"
                                    :options="programOptions"
                                    placeholder="Select an option"
                                    @update:value="getProgramID"
                                    disabled
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
                                <template v-if="showReceipientView.programType_id == 1">
                                <n-form-item>
                                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                                </n-form-item>
                                <n-card :hoverable="true" class="shadow-md">
                                    <n-space class="mt-2" vertical :size="15">
                                    <!--Program Type-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Program Type</n-gi>
                                        <n-gi>{{ showReceipientView.typeName }}</n-gi>
                                    </n-grid>
                                    <!--Amount Rate-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Amount Rate</n-gi>
                                        <n-gi>RM {{ showReceipientView.individual_disburse_amount }}</n-gi>
                                    </n-grid>
                                    <!--Frequency-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Frequency</n-gi>
                                        <n-gi>{{ showReceipientView.individual_frequency_name }}</n-gi>
                                    </n-grid>
                                    <!--One Time-->
                                    <template v-if="showReceipientView.individual_frequency_id == 1">
                                        <!--payment date-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Payment Date</n-gi>
                                        <n-gi>{{ showReceipientView.individual_payment_date }}</n-gi>
                                        </n-grid>
                                    </template>
                                    <!--Monthly-->
                                    <template v-if="showReceipientView.individual_frequency_id == 2">
                                        <!--payment date-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Payment Date</n-gi>
                                        <n-gi>{{ showReceipientView.individual_payment_date }}</n-gi>
                                        </n-grid>
                                        <!--Total Month-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Total Month</n-gi>
                                        <n-gi>{{ showReceipientView.individual_total_month }} Months</n-gi>
                                        </n-grid>
                                        <!--End date-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>End Date</n-gi>
                                        <n-gi></n-gi>
                                        </n-grid>
                                    </template>
                                    <!--Year-->
                                    <template v-if="showReceipientView.individual_frequency_id == 3">
                                        <!--payment date-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Payment Date</n-gi>
                                        <n-gi>{{ showReceipientView.individual_payment_date }}</n-gi>
                                        </n-grid>
                                        <!--Total Year-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Total Year</n-gi>
                                        <n-gi>{{ showReceipientView.individual_total_year }} Years</n-gi>
                                        </n-grid>
                                        <!--End date-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>End Date</n-gi>
                                        <n-gi></n-gi>
                                        </n-grid>
                                    </template>
                                    <!--Multiple-->
                                    <template v-if="showReceipientView.individual_frequency_id == 4">
                                    <!--Shedular-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Shedular Payment</n-gi>
                                        <n-gi>
                                        <template v-for="(multiple_date, index) in showReceipientView.individual_multiple_date" :key="index">
                                            <div class="mb-1">{{ formatDate(multiple_date.payment_date) }}</div>
                                        </template>
                                        </n-gi>
                                    </n-grid>                        
                                    </template>
                                    </n-space>
                                </n-card>
                                </template>
                                <!--Group-->
                                <template v-if="showReceipientView.programType_id == 2">
                                <n-form-item>
                                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                                </n-form-item>
                                <n-space class="mt-2" vertical :size="25">
                                    <!--Proram Type-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                    <n-gi>Program Type</n-gi>
                                    <n-gi>{{ showReceipientView.typeName }}</n-gi>
                                    </n-grid>
                                    <!--Amount Rate-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                    <n-gi>Amount Rate</n-gi>
                                    <n-gi>RM {{ showReceipientView.programDisburse_amount }}</n-gi>
                                    </n-grid>
                                    <!--Frequency-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                    <n-gi>Frequency</n-gi>
                                    <n-gi>{{ showReceipientView.programFrequency_name }}</n-gi>
                                    </n-grid>
                                    <!--Start Date-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                    <n-gi>Date Payment</n-gi>
                                    <n-gi>{{ showReceipientView.programPayment_date }}</n-gi>
                                    </n-grid>
                                    <template v-if="showReceipientView.programFrequency_id != 1">
                                    
                                    <template v-if="showReceipientView.programFrequency_id == 2">
                                        <!--Total Month-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Total Month</n-gi>
                                        <n-gi>{{ showReceipientView.programGroupTotalMonth }} Months</n-gi>
                                        </n-grid>
                                    </template>
                                    <template v-if="showReceipientView.programFrequency_id == 3">
                                        <!--Total Month-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Total Year</n-gi>
                                        <n-gi>{{ showReceipientView.programGroupTotalYear }} Years</n-gi>
                                        </n-grid>
                                    </template>
                                        <!--End Date-->
                                        <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>End Date</n-gi>
                                        <n-gi>2024-03-22</n-gi>
                                        </n-grid>
                                    </template>
                                    
                                </n-space>
                                </template>
                                <!--Schedule-->
                                <template v-if="showReceipientView.programType_id == 3">
                                <n-form-item>
                                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                                </n-form-item>
                                <n-space class="mt-2" vertical :size="25">
                                    <!--Program Type-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                    <n-gi>Program Type</n-gi>
                                    <n-gi>{{ showReceipientView.typeName }}</n-gi>
                                    </n-grid>
                                    <!--Amount Rate-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                    <n-gi>Amount Rate</n-gi>
                                    <n-gi>RM {{ showReceipientView.programDisburse_amount }}</n-gi>
                                    </n-grid>
                                    <p class="text-black mb-2">Payment Date</p>
                                </n-space>
                                    <!--Payment Date-->
                                <template v-for="(installment_program, index) in showReceipientView.installment_programs" :key="index">
                                    <n-grid class="ml-5 mb-1" :cols="2">
                                        <n-gi>
                                        {{ formatDate(installment_program.payment_date) }}
                                        </n-gi>
                                        <n-gi class="-ml-5">
                                        RM {{ installment_program.amount }}
                                        </n-gi>
                                    </n-grid>
                                </template>
                                </template>
                                <!--Batch-->
                                <template v-if="showReceipientView.programType_id == 4">
                                <n-form-item>
                                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                                </n-form-item>
                                <n-space class="mt-2" vertical :size="25">
                                    <!--Program Type-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                    <n-gi>Program Type</n-gi>
                                    <n-gi>{{ showReceipientView.typeName }}</n-gi>
                                    </n-grid>
                                    <!--Amount Rate-->
                                    <n-grid x-gap="space-x-12" :cols="2">
                                    <n-gi>Amount Rate</n-gi>
                                    <n-gi>RM {{ showReceipientView.programDisburse_amount }}</n-gi>
                                    </n-grid>
                                    <p class="text-black mb-2">Payment Date</p>
                                </n-space>
                                    <!--Payment Date-->
                                    <template v-for="(installment_program, index) in showReceipientView.installment_programs" :key="index">
                                    <n-grid class="ml-5 mb-1" :cols="2">
                                        <n-gi>
                                            {{ installment_program.name }}
                                        </n-gi>
                                        <n-gi>
                                            {{ formatDate(installment_program.payment_date) }}
                                        </n-gi>
                                    </n-grid>
                                </template>
                                </template>
                            </n-gi>
                        </n-grid>
                        <div class="flex justify-end space-x-3">
                            <n-button @click="showSingleReject = true" type="error" style="width: 135px;">
                                <template #icon>
                                    <n-icon>
                                        <Close/>
                                    </n-icon>
                                </template>
                                Reject
                            </n-button>
                            <n-button @click="showSingleEndorse = true" type="primary" style="width: 135px;">
                                <template #icon>
                                    <n-icon>
                                        <CheckmarkDoneSharp/>
                                    </n-icon>
                                </template>
                                Recommend
                            </n-button>
                        </div>
                        <!---->
                        <n-modal
                            v-model:show="showSingleEndorse"
                            :mask-closable="false"
                            preset="dialog"
                            icon-placement="top"
                            content="Are you sure to endorse this program?"
                            positive-text="Confirm"
                            negative-text="Cancel"
                            @positive-click="singleConfirmApprove(checkID)"
                            @negative-click="singleCancelApprove(checkID)"
                        />
                        <!--Show Reject-->
                        <n-modal
                            v-model:show="showSingleReject"
                            :mask-closable="false"
                            preset="dialog"
                            type="error"
                            icon-placement="top"
                            content="Are you sure to reject this program?"
                            positive-text="Confirm"
                            negative-text="Cancel"
                            @positive-click="singleConfirmReject"
                            @negative-click="singleCancelReject"
                        />
                    </n-form>
                </n-card>
            </n-modal>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, h, reactive, computed } from "vue";
import { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NGrid, NGi, useMessage, NIcon, NSelect } from "naive-ui"
import axios from 'axios'
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';
import MdAddCircleOutline from "@vicons/ionicons4/MdAddCircleOutline";
import Add12Filled from "@vicons/fluent/Add12Filled";
import MdSearch from "@vicons/ionicons4/MdSearch";
import { format } from 'date-fns';
import { CheckmarkDoneSharp, Close } from '@vicons/ionicons5'

const showReceipient = ref(false);
const programs = ref([])
const banks = ref([])
const programOptions = ref(false);
const bankOptions = ref(false);

const showSingleEndorseRef = ref(false);
const showSingleRejectRef = ref(false);
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
    },
    prefix({ itemCount }) {
    const startItem = (pagination.page - 1) * pagination.pageSize + 1;
    const endItem = Math.min(pagination.page * pagination.pageSize, itemCount);
    return `${startItem}-${endItem} of ${itemCount}`;
    },
})

const showReceipientView = reactive({
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
        payment_date: '',
        type_id: '',
        total_month: '',

        typeName: '',

        programType_id: '',
        programDisburse_amount: '',
        programFrequency_id: '',
        programFrequency_name: '',
        programPayment_date: '',

        programGroupTotalMonth: '',
        programGroupTotalYear:''
});

const formatDate = (date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : null;
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

        console.log(programs.value);
        console.log(programOptions.value);
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

        console.log(banks.value);
        console.log(bankOptions.value);
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

let selectedReceipientId = null;

const view = async (id) => {
    showReceipient.value = true;
    selectedReceipientId = id;
	console.log('here', selectedReceipientId)
    let url = import.meta.env.VITE_BACKEND_URL +`/api/receipients/show/${id}`;
    try {
    const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    console.log(response);

    const receipientData = response.data.receipient;

    showReceipientView.name = receipientData.name || null;
            showReceipientView.identification_number = receipientData.identification_number || null;
            showReceipientView.address = receipientData.address || null;
            showReceipientView.postcode = receipientData.postcode || null;
            showReceipientView.phone_number = receipientData.phone_number || null;
            showReceipientView.email = receipientData.email || null;
            showReceipientView.bank_id = receipientData.bank_id || null;
            showReceipientView.account_number = receipientData.account_number || null;
            showReceipientView.program_id = receipientData.program_id || null;
            showReceipientView.disburse_amount = receipientData.disburse_amount || null;
            showReceipientView.frequency_id = receipientData.frequency_id || null;
            showReceipientView.payment_date = formatDate(receipientData.payment_date) || null;
            showReceipientView.type_id = receipientData.type_id || null;
            showReceipientView.total_month = receipientData.total_month || null;
            showReceipientView.typeName = receipientData.program.type.name || null;
            showReceipientView.programType_id = receipientData.program.type_id || null;
            showReceipientView.programDisburse_amount = receipientData.program.disburse_amount || null;
            showReceipientView.programGroupTotalMonth = receipientData.program.total_month || null;
            showReceipientView.programGroupTotalYear = receipientData.program.total_year || null;
            try {
              if (receipientData && receipientData.program.frequency) {
                showReceipientView.programFrequency_id = receipientData.program.frequency.id || null;
                showReceipientView.programFrequency_name = receipientData.program.frequency.name || null;
                showReceipientView.programPayment_date = receipientData.program.payment_date || null;
              } else {
                // console.warn('Frequency data is not available.');
              }

              } catch (innerError) {
                console.error('Error handling frequency data:', innerError);
            }

            try {
              if (receipientData && receipientData.individual_recipient) {
                showReceipientView.individual_disburse_amount = receipientData.individual_recipient.disburse_amount || null;
                showReceipientView.individual_frequency_name = receipientData.individual_recipient.frequency.name || null;
                showReceipientView.individual_frequency_id = receipientData.individual_recipient.frequency.id || null;
                showReceipientView.individual_payment_date = formatDate(receipientData.individual_recipient.payment_date) || null;
                showReceipientView.individual_total_month = receipientData.individual_recipient.total_month || null;
                showReceipientView.individual_total_year = receipientData.individual_recipient.total_year || null;

                if(receipientData && receipientData.individual_recipient.schedular){
                  showReceipientView.individual_multiple_date = receipientData.individual_recipient.schedular || null;
                }
              } else {
                console.log('Individual data is not available.');
              }

              } catch (innerError) {
                console.error('Error handling frequency data:', innerError);
            }

            try {
              if (receipientData && receipientData.program.installment_programs) {
                showReceipientView.installment_programs = receipientData.program.installment_programs
              } else {
                console.log('Frequency data is not available.');
              }

              } catch (innerError) {
                console.error('Error handling frequency data:', innerError);
            }

          } catch (error) {
            console.error(error);
          }
};

const createColumns = () => [
    //Selection
	{
		type: "selection",
        key: "id",
		width: 50,
	},
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
        width: 140,
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
				onClick: () => view(row.id)
				},
				{ default: () => "View" }
			);
		}
    }
];

const dataTableInstRef = ref(null)

export default defineComponent({
	components: { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NGrid, NGi, NIcon, NSelect, MdSearch, CheckmarkDoneSharp, Close },
  setup() {
	const checkedRowKeys = ref([]);
	const recommendations = ref([])
    const message = useMessage();
    const showEndorseRef = ref(false);
    const showRejectRef = ref(false);

    const rowKey = (row) => row.id;

	const handleCheck = (keys) => {
      checkedRowKeys.value = keys;
    };

	const handleEndorseClick = async () => {};

	const getRecommendations = async () => {
		try {
			const url = import.meta.env.VITE_BACKEND_URL +'/api/receipients/recommendation'
			const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
			recommendations.value = response.data.recommendations
			console.log(recommendations.value)
		} catch (error) {
			console.error(error)
		}
	}
	getRecommendations()

    const searchQuery = ref('');
    const filteredRecommendations = computed(() => {
        const lowerSearchQuery = searchQuery.value.toLowerCase();
        return recommendations.value.filter(recommendation => 
        recommendation.name.toLowerCase().includes(lowerSearchQuery) ||
        recommendation.program.code.toLowerCase().includes(lowerSearchQuery) ||
        recommendation.program.name.toLowerCase().includes(lowerSearchQuery) ||
        recommendation.program.type.name.toLowerCase().includes(lowerSearchQuery) ||
        recommendation.status.name.toLowerCase().includes(lowerSearchQuery)  
        );
    });

    return {
        filteredRecommendations,
		searchQuery,
        formatDate,
        singleConfirmApprove() {
		try {
				const receipientId = selectedReceipientId;

                console.log('selected IDs:', receipientId);

				axios.put(import.meta.env.VITE_BACKEND_URL +'/api/receipients/singleRecommendation', { receipientId }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
				.then((response) => {
					console.log('Update Status Response:', response.data);

					Swal.fire({
					width: 400,
					html: '<span class="text-sm">Program Has Successfully Been Recommended!</span>',
					icon: 'success',
					confirmButtonText: 'Okay',
					customClass: {
						content: 'text-sm',
						confirmButton: 'px-4 py-2 text-white text-xs rounded',
					},
					}).then((result) => {
					if (result.isConfirmed) {
						window.location.reload();
					}
					});

					checkedRowKeys.value = [];
				})
				.catch((error) => {
					console.error('Error updating status:', error);

					Swal.fire({
					width: 400,
					html: '<span class="text-sm">Error updating status!</span>',
					icon: 'error',
					confirmButtonText: 'Okay',
					customClass: {
						content: 'text-sm',
						confirmButton: 'px-4 py-2 text-white text-xs rounded',
					},
					});
				});

			showEndorseRef.value = false;
			showReceipient.value = false;
			} catch (error) {
			console.error(error);
			message.error("Error submitting. Please try again.");
			}
		},
        singleCancelApprove() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
        singleConfirmReject() {
            showReceipient.value = false;
			try {
				const receipientId = selectedReceipientId;

                console.log('selected IDs:', receipientId);
				Swal.fire({
					input: "textarea",
					inputLabel: "Reason To Reject",
					inputPlaceholder: "Type your reason here...",
					inputAttributes: {
						"aria-label": "Type your reason here"
					},
					showCancelButton: true,
					confirmButtonText: 'Submit',
					cancelButtonText: 'Cancel',
					customClass: {
						content: 'text-sm',
						confirmButton: 'px-4 py-2.5 text-white text-xs rounded',
						cancelButton: 'px-4 py-2.5 text-white text-xs rounded',
					},
					preConfirm: (value) => {
						if (!value.trim()) {
						Swal.showValidationMessage('Message is required');
						}
					}
							
				}).then(async ({ value: text, isConfirmed, dismiss }) => {
					if (isConfirmed && text) {
						axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/receipients/singleRejectSubmitted`, { receipientId, text}, {
							headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
						})
						.then((response) => {
							console.log('User confirmed with reason:', text);
							console.log('Update Status Response:', response.data);

							Swal.fire({
								width: 400,
								html: '<span class="text-sm">Recipient has successfully rejected!</span>',
								icon: 'success',
								confirmButtonText: 'Okay',
								customClass: {
									content: 'text-sm',
									confirmButton: 'px-4 py-2 text-white text-xs rounded',
								},
							}).then((result) => {
								if (result.isConfirmed) {
									window.location.reload();
								}
							});

							checkedRowKeys.value = [];
						})
						.catch((error) => {
							console.error('Error updating status:', error);

							Swal.fire({
								width: 400,
								html: '<span class="text-sm">Error updating status!</span>',
								icon: 'error',
								confirmButtonText: 'Okay',
								customClass: {
									content: 'text-sm',
									confirmButton: 'px-4 py-2 text-white text-xs rounded',
								},
							});
						});
						showRejectRef.value = false;
						showReceipient.value = false;
					} else if (dismiss === Swal.DismissReason.cancel) {
						showRejectRef.value = false;
						showReceipient.value = false;
					}
				});
			} catch (error) {
				console.error(error);
				message.error("Error submitting. Please try again.");
			}
        },
        singleCancelReject() {
            message.success("Cancel");
            showRejectRef.value = false;
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
                payment_date:""
            };
        },
        showSingleEndorse: showSingleEndorseRef,
        showSingleReject: showSingleRejectRef,
        getProgramID,
        showBank: ref(false),
        bankOptions,
        showProgram: ref(false),
        programOptions,
        banks,
        programs,
        showReceipient,
        showReceipientView,
        pagination,
        align: ref("left"),
        placement: ref("left"),
        rowKey,
		handleCheck,
		checkedRowKeys,
		handleEndorseClick,
        MdAddCircleOutline,
        Add12Filled,
        MdSearch,
        showEndorse: showEndorseRef,
        showReject: showRejectRef,
        bulkConfirmApprove() {
            try {
                const checkedIDs = checkedRowKeys.value;

                console.log('Checked IDs:', checkedIDs);

                if (checkedIDs.length > 0) {
                    axios.put(import.meta.env.VITE_BACKEND_URL +'/api/receipients/endorse', { checkedIDs }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                    .then((response) => {
                        console.log('Update Status Response:', response.data);

                        Swal.fire({
                        width: 400,
                        height: 70,
                        html: '<span class="text-sm">Receipient Has Successfully Been Recommended!</span>',
                        icon: 'success',
                        confirmButtonText: 'Okay',
                        customClass: {
                            content: 'text-sm',
                            confirmButton: 'px-4 py-2 text-white text-xs rounded',
                        },
                        }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                        });

                        checkedRowKeys.value = [];
                    })
                    .catch((error) => {
                        console.error('Error updating status:', error);

                        Swal.fire({
                        width: 400,
                        height: 70,
                        html: '<span class="text-sm">Error updating status!</span>',
                        icon: 'error',
                        confirmButtonText: 'Okay',
                        customClass: {
                            content: 'text-sm',
                            confirmButton: 'px-4 py-2 text-white text-xs rounded',
                        },
                        });
                    });
                }

                showEndorseRef.value = false;
                } catch (error) {
                console.error(error);
                message.error("Error submitting. Please try again.");
                }
        },
        bulkCancelApprove() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
        bulkConfirmReject() {
            try {
				const checkedIDs = checkedRowKeys.value;
                const userId = localStorage.getItem('userId');
				console.log('Checked IDs:', checkedIDs);

				Swal.fire({
				input: "textarea",
				inputLabel: "Reason To Reject",
				inputPlaceholder: "Type your reason here...",
				inputAttributes: {
					"aria-label": "Type your reason here"
				},
				showCancelButton: true,
				confirmButtonText: 'Submit',
				cancelButtonText: 'Cancel',
				customClass: {
					content: 'text-sm',
					confirmButton: 'px-4 py-2.5 text-white text-xs rounded',
					cancelButton: 'px-4 py-2.5 text-white text-xs rounded',
				},
				preConfirm: (value) => {
					if (!value.trim()) {
					Swal.showValidationMessage('Message is required');
					}
				}
				}).then(async ({ value: text, isConfirmed, dismiss }) => {
				if (isConfirmed && text) {
					try {
					axios.put(import.meta.env.VITE_BACKEND_URL + '/api/receipients/bulkRejectRecommendation', { checkedIDs, userId, text }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
						.then((response) => {
						console.log('Update Status Response:', response.data);

						Swal.fire({
							width: 400,
							html: '<span class="text-sm">Recipient Has Successfully Been Rejected!</span>',
							icon: 'success',
							confirmButtonText: 'Okay',
							customClass: {
							content: 'text-sm',
							confirmButton: 'px-4 py-2 text-white text-xs rounded',
							},
						}).then((result) => {
							if (result.isConfirmed) {
							window.location.reload();
							}
						});

						checkedRowKeys.value = [];
						})
						.catch((error) => {
						console.error('Error updating status:', error);

						Swal.fire({
							width: 400,
							html: '<span class="text-sm">Error updating status!</span>',
							icon: 'error',
							confirmButtonText: 'Okay',
							customClass: {
							content: 'text-sm',
							confirmButton: 'px-4 py-2 text-white text-xs rounded',
							},
						});
						});
					} catch (error) {
					console.error(error);
					message.error("Error submitting. Please try again.");
					}
				} else if (dismiss === Swal.DismissReason.cancel) {
					showEndorseRef.value = false;
				}
				});
			} catch (error) {
				console.error(error);
				message.error("Error submitting. Please try again.");
			}
        },
        bulkCancelReject() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
		columns: createColumns({
			play(row) {
			message.info(`Play ${row.title}`);
			}
		}),
		recommendations,
		dataTableInst: dataTableInstRef
    };
  }
});
</script>
