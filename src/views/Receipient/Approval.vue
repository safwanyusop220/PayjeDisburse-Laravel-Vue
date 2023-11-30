<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
			<p class="font-bold text-xl text-black">Approval</p>
			<div class="flex justify-between space-x-10">
                <n-input class="" placeholder="Search">
					<template #prefix>
						<n-icon :component="MdSearch" />
					</template>
				</n-input>
				<div class="flex space-x-3">
					<template v-if="checkedRowKeys.length > 0">
						<n-button @click="showReject = true" type="error" style="width: 110px;">
							Reject 
							<p class="bg-white text-red-600 ml-1.5 text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{{ checkedRowKeys.length }}
							</p>
						</n-button>
					</template>
					<template v-if="checkedRowKeys.length == 0">
						<n-button  type="error" style="width: 110px;">
							Reject 
						</n-button>
					</template>
					<template v-if="checkedRowKeys.length > 0">
						<n-button @click="showApprove = true" type="success" style="width: 110px;">
							Approve
							<p class="bg-white text-green-600 ml-1.5 text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{{ checkedRowKeys.length }}
							</p>					
						</n-button>
					</template>
					<template v-if="checkedRowKeys.length == 0">
						<n-button  type="success" style="width: 110px;">
							Approve				
						</n-button>
					</template>
					<!--Show Endorse-->
					<n-modal
						v-model:show="showApprove"
						:mask-closable="false"
						preset="dialog"
						icon-placement="top"
						content="Are you sure to approve this program?"
						positive-text="Confirm"
						negative-text="Cancel"
						@positive-click="onPositiveClick"
						@negative-click="onNegativeClick"
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
						@positive-click="onPositiveClick1"
						@negative-click="onNegativeClick1"
					/>
				</div>
			</div>
			<n-data-table
				ref="dataTableInst"
				:columns="columns"
				:data="approvals"
				:pagination="pagination"
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
                                <!--Disburse Amount-->
                                <n-form-item label="Disburse Amount">
                                    <n-input-number class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Amount">
                                    <template #prefix>
                                        RM
                                    </template>
                                    </n-input-number>
                                </n-form-item>
                                <!--Frequency-->
                                <n-form-item label="Frequency">
                                    <n-radio-group v-model:value="showReceipientView.frequency_id">
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
                                <!--One Time-->
                                <template v-if="showReceipientView.frequency_id == 1">
                                    <!--Payment Date-->
                                    <n-form-item label="Payment Date">
                                    <n-input
                                        type="date"
                                        clearable
                                        placeholder=" "
                                    />
                                    </n-form-item>
                                </template>
                                <template v-if="showReceipientView.frequency_id == 2">
                                    <!--Payment Date-->
                                    <n-form-item label="Payment Date">
                                    <n-input
                                        type="date"
                                        clearable
                                        placeholder=" "
                                    />
                                    </n-form-item>
                                    <!--Total Month-->
                                    <n-form-item label="Total Month">
                                    <n-input-number v-model:value="showReceipientView.total_month" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Month">
                                    </n-input-number>
                                    </n-form-item>
                                </template>
                                <!--Year-->
                                <template v-if="showReceipientView.frequency_id == 3">
                                    <!--Payment Date-->
                                    <n-form-item label="Payment Date">
                                    <n-input
                                        type="date"
                                        clearable
                                        placeholder=" "
                                    />
                                    </n-form-item>
                                    <!--Total Year-->
                                    <n-form-item label="Total Year">
                                    <n-input-number v-model:value="showReceipientView.total_year" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Year">
                                    </n-input-number>
                                    </n-form-item>
                                </template>
                                <!--Multiple-->
                                <template v-if="showReceipientView.frequency_id == 4">
                                <!--Multiple-->
                                <n-grid x-gap="" :cols="1">
                                    <n-gi>
                                    <n-form-item label="Schedular Payment">
                                        <n-dynamic-input
                                        v-model:value="showReceipientView.dynamicInputValue"
                                        class="w-full"
                                        item-style="margin-bottom: -15px;"
                                        :on-create="onCreate"
                                        #="{ index, value }"
                                        >
                                        <div style="display: flex">
                                            <div style="height: 34px; line-height: 34px; margin: 0 8px">
                                            </div>
                                            <n-form-item
                                            ignore-path-change
                                            :show-label="false"
                                            size="medium"
                                            :path="`receipient.dynamicInputValue[${index}].payment_date`"
                                            :rule="testValidation"
                                            >
                                            <n-input
                                                type="date"
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
                            <n-button @click="showSingleReject = true" type="error" style="width: 80px;">
                                Reject
                            </n-button>
                            <n-button @click="showSingleEndorse = true" type="primary" style="width: 80px;">
                                Approve
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
                            @positive-click="onSinglePositiveClick(checkID)"
                            @negative-click="onSingleNegativeClick(checkID)"
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
                            @positive-click="onSinglePositiveClick1"
                            @negative-click="onSingleNegativeClick1"
                        />
                    </n-form>
                </n-card>
            </n-modal>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, h, reactive } from "vue";
import { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NInputNumber, NGrid, NGi, NIcon, NSelect, NDynamicInput, NRadio, NRadioGroup, useMessage } from "naive-ui"
import axios from 'axios'
import MdAddCircleOutline from "@vicons/ionicons4/MdAddCircleOutline";
import Add12Filled from "@vicons/fluent/Add12Filled";
import MdSearch from "@vicons/ionicons4/MdSearch";
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';
import IosEye from "@vicons/ionicons4/IosEye";
import { format } from 'date-fns';

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
    }
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
    showReceipientView.payment_date = receipientData.payment_date || null;
    showReceipientView.type_id = receipientData.type_id || null;
    showReceipientView.total_month = receipientData.total_month || null;

    showReceipientView.typeName = receipientData.program.type.name || null;

    showReceipientView.programType_id = receipientData.program.type_id || null;
    showReceipientView.programDisburse_amount = receipientData.program.disburse_amount || null;

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
        if (receipientData && receipientData.program.installment_programs) {
        showReceipientView.installment_programs = receipientData.program.installment_programs
        } else {
        // console.warn('Frequency data is not available.');
        }

        } catch (innerError) {
        console.error('Error handling frequency data:', innerError);
    }

    showReceipientView.programGroupTotalMonth = receipientData.program.total_month || null;
    showReceipientView.programGroupTotalYear = receipientData.program.total_year || null;

    } catch (error) {
    console.error(error);
    }
};

const createColumns = () => [
	//Selection
	{
		type: "selection",
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
	components: { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NInputNumber, NGrid, NGi, NIcon, NSelect, NDynamicInput, NRadio, NRadioGroup, MdSearch },
  setup() {
	const checkedRowKeys = ref([]);
	const approvals = ref([])
	const message = useMessage();
    const showApproveRef = ref(false);
	const showRejectRef = ref(false);

	const getApprovals = async () => {
		try {
			const url = import.meta.env.VITE_BACKEND_URL +'/api/receipients/approval'
			const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
			approvals.value = response.data.approvals
			console.log(approvals.value)
		} catch (error) {
			console.error(error)
		}
	}

	getApprovals()

    const rowKey = (row) => row.id;

	const handleCheck = (keys) => {
      checkedRowKeys.value = keys;
    };

	const handleEndorseClick = async () => {
	};

    return {
		formatDate,
        onSinglePositiveClick() {
		try {
				const receipientId = selectedReceipientId;

                console.log('selected IDs:', receipientId);

				axios.put(import.meta.env.VITE_BACKEND_URL +'/api/receipients/singleApprove', { receipientId }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
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

			showApproveRef.value = false;
			showReceipient.value = false;
			} catch (error) {
			console.error(error);
			message.error("Error submitting. Please try again.");
			}
		},
        onSingleNegativeClick() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
        onSinglePositiveClick1() {
            try {
                Swal.fire({
                    width: 400,
                    // title: 'Success',
                    html: '<span class="text-sm">Program Has Successfully Been Rejected!</span>',
                    icon: 'success',
                    confirmButtonText: 'Okay',
                    customClass: {
                        content: 'text-sm',
                        confirmButton: 'px-4 py-2 text-white text-xs rounded',
                    }
                });

                showRejectRef.value = false;
            } catch (error) {
                console.error(error);
                message.error("Error submitting. Please try again.");
            }
        },
        onSingleNegativeClick1() {
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
        align: ref("left"),
        placement: ref("left"),
        rowKey,
		handleCheck,
		checkedRowKeys,
		handleEndorseClick,
		showApprove: showApproveRef,
        showReject: showRejectRef,
		onPositiveClick() {
		try {
			const checkedIDs = checkedRowKeys.value;

			console.log('Checked IDs:', checkedIDs);

			if (checkedIDs.length > 0) {
				axios.put(import.meta.env.VITE_BACKEND_URL +'/api/receipients/approve', { checkedIDs }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
				.then((response) => {
					console.log('Update Status Response:', response.data);

					Swal.fire({
					width: 400,
					height: 70,
					html: '<span class="text-sm">Receipient Has Successfully Been Approved!</span>',
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

			showApproveRef.value = false;
			} catch (error) {
			console.error(error);
			message.error("Error submitting. Please try again.");
			}
		},
        onNegativeClick() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
		onPositiveClick1() {
            try {
                Swal.fire({
                    width: 400,
                    height: 70,
                    // title: 'Success',
                    html: '<span class="text-sm">Program Has Successfully Been Rejected!</span>',
                    icon: 'success',
                    confirmButtonText: 'Okay',
                    customClass: {
                        content: 'text-sm',
                        confirmButton: 'px-4 py-2 text-white text-xs rounded',
                    }
                });

                showRejectRef.value = false;
            } catch (error) {
                console.error(error);
                message.error("Error submitting. Please try again.");
            }
        },
        onNegativeClick1() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
        MdAddCircleOutline,
        Add12Filled,
        MdSearch,
        IosEye,
		columns: createColumns({
			play(row) {
			message.info(`Play ${row.title}`);
			}
		}),
		approvals,
		dataTableInst: dataTableInstRef,
		pagination
    };
  }
});
</script>
