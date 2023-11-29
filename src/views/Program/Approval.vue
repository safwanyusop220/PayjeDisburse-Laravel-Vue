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
					<div class="flex justify-end space-x-3">
						<n-button @click="showSingleReject = true" type="error" style="width: 80px;">
							Reject
						</n-button>
						<n-button @click="showSingleEndorse = true" type="primary" style="width: 80px;">
							Approve
						</n-button>
					</div>
					<!--Show Endorse-->
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
import { defineComponent, ref, h, reactive, computed } from "vue";
import {NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NInputNumber, NGrid, NGi, useMessage, NIcon} from "naive-ui"
import axios from 'axios'
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';
import MdSearch from "@vicons/ionicons4/MdSearch";
import { format } from 'date-fns';

const showProgram = ref(false);
const installment_data = ref([])

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
			// installment_data: []
});

const formatDate = (date) => {
	return date ? format(new Date(date), 'dd/MM/yyyy') : null;
};

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
let selectedProgramId = null;

const view = async (id) => {
	showProgram.value = true;
	selectedProgramId = id;
	console.log('here', selectedProgramId)
	let url = import.meta.env.VITE_BACKEND_URL +`/api/programs/show/${id}`;

	try {
	const response = await axios.get(url);
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
	//code
	{
		title: "Program Code",
		key: "code",
		width: 120,
	},
	//Name
	{
		title: "Program Name",
		key: "name",
		width: 130,
	},
	//Type
	{
		title: "Program Type",
		key: "type.name",
		resizable: true,
		width: 150,
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
		width: 170,
		sorter: (row1, row2) => row1.disburse_amount - row2.disburse_amount,
		render: (row) => {
            // Format disburse_amount with "RM" prefix
            const formattedAmount = `RM ${row.disburse_amount}`;
            return formattedAmount;
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
	components: {NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NInputNumber, NGrid, NGi, NIcon},
  setup() {
	const checkedRowKeys = ref([]);
	const approvals = ref([])

	const message = useMessage();
    const showApproveRef = ref(false);
	const showRejectRef = ref(false);
	const showSingleEndorseRef = ref(false);
	const showSingleRejectRef = ref(false);

	const getApprovals = async () => {
		try {
			const url = import.meta.env.VITE_BACKEND_URL +'/api/programs/approval'
			const response = await axios.get(url)
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
		installment_data,
		formattedYear,
		formattedMonth,
		formattedBankPanel,
		showProgramView,
		program,
		showProgram,
		rowKey,
		handleCheck,
		checkedRowKeys,
		handleEndorseClick,
		showSingleEndorse: showSingleEndorseRef,
        showSingleReject: showSingleRejectRef,
		onSinglePositiveClick() {
		try {
				const programId = selectedProgramId;

                console.log('selected IDs:', programId);

				axios.put(import.meta.env.VITE_BACKEND_URL +'/api/programs/singleApprove', { programId })
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
			showProgram.value = false;
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
		showApprove: showApproveRef,
        showReject: showRejectRef,
		onPositiveClick() {
		try {
			const checkedIDs = checkedRowKeys.value;

			console.log('Checked IDs:', checkedIDs);

			if (checkedIDs.length > 0) {
				axios.put(import.meta.env.VITE_BACKEND_URL +'/api/programs/approve', { checkedIDs })
				.then((response) => {
					console.log('Update Status Response:', response.data);

					Swal.fire({
					width: 400,
					html: '<span class="text-sm">Program Has Successfully Been Approved!</span>',
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
		MdSearch,
		columns: createColumns({
			play(row) {
			message.info(`Play ${row.title}`);
			}
		}),
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
		approvals,
		dataTableInst: dataTableInstRef,
		pagination
    };
  }
});
</script>
