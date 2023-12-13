<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
			<p class="font-bold text-xl text-black">Recommendation</p>
			<div class="flex justify-between space-x-10">
				<n-input class="" placeholder="Search">
					<template #prefix>
						<n-icon :component="MdSearch" />
					</template>
				</n-input>
				<div class="flex space-x-3">
					<template v-if="checkedRowKeys.length > 0">
						<n-button @click="showReject = true" type="error" style="width: 120px; font-size: 12px">
							Reject 
							<p class="bg-white text-red-600 ml-1.5 text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{{ checkedRowKeys.length }}
							</p>
						</n-button>
					</template>
					<template v-if="checkedRowKeys.length == 0">
						<n-button  type="error" style="width: 120px; font-size: 12px">
							Reject 
						</n-button>
					</template>
					<template v-if="checkedRowKeys.length > 0">
						<!-- <n-button @click="$event => { showEndorse = true; approveProgram(program.id); }" type="success" style="width: 110px;"> -->
						<n-button @click="showEndorse = true" type="success" style="width: 125px; font-size: 12px">
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
					<!--Show Endorse-->
					<n-modal
						v-model:show="showEndorse"
						:mask-closable="false"
						preset="dialog"
						icon-placement="top"
						content="Are you sure to endorse this program?"
						positive-text="Confirm"
						negative-text="Cancel"
						@positive-click="bulkRecommendConfirm"
						@negative-click="bulkRecommendCancel"
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
						@positive-click="bulkRejectConfirm"
						@negative-click="bulkRejectCancel"
					/>
				</div>
			</div>
			<n-data-table
				ref="dataTableInst"
				:columns="columns"
				:data="recommendations"
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
							<n-input class="w-1/2" v-model:value="showProgramView.name" disabled/>
						</n-form-item>
						</n-gi>
						<n-gi>
						<n-form-item label="Program Code">
							<n-input v-model:value="showProgramView.code" disabled/>
						</n-form-item>
						</n-gi>
					</n-grid>
					<!--Program type/Panel Bank-->
					<n-grid x-gap="22" :cols="2">
						<n-gi>
						<n-form-item label="Program Type">
							<n-input class="w-1/2" v-model:value="showProgramView.type.name" disabled/>
						</n-form-item>
						</n-gi>
						<n-gi>
						<n-form-item label="Bank Panel">
							<n-input v-model:value="formattedBankPanel" disabled/>
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
								<n-input-number class="w-full" v-model:value="showProgramView.disburse_amount" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" disabled>
									<template #prefix>
									RM
									</template>
								</n-input-number>
								</n-form-item>
							</n-gi>
						</n-grid>
						<!--Payment Date/-->
						<n-grid x-gap="22" :cols="2">
							<n-gi>
								<n-form-item label="Payment Date">
								<n-input class="w-1/2" v-model:value="showProgramView.payment_date" disabled/>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="Frequency">
								<n-input v-model:value="showProgramView.frequency.name" disabled/>
								</n-form-item>
							</n-gi>
						</n-grid>
						<!--Monthly-->
						<template v-if="showProgramView.frequency_id == 2">
						<n-grid x-gap="22" :cols="2">
							<n-gi>
							<n-form-item label="Total Months">
								<n-input class="w-1/2" v-model:value="formattedMonth" disabled/>
							</n-form-item>
							</n-gi>
							<n-gi>
							<n-form-item label="End Date">
								<n-input class="w-1/2" v-model:value="showProgramView.end_date" disabled/>
							</n-form-item>
							</n-gi>
						</n-grid>
						</template>
						<!--Yearly-->
						<template v-if="showProgramView.frequency_id == 3">
						<n-grid x-gap="22" :cols="2">
							<n-gi>
							<n-form-item label="Total Years">
								<n-input class="w-1/2" v-model:value="formattedYear" disabled/>
							</n-form-item>
							</n-gi>
							<n-gi>
							<n-form-item label="End Date">
								<n-input class="w-1/2" v-model:value="showProgramView.end_date" disabled/>
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
							<n-input-number class="w-full" v-model:value="showProgramView.disburse_amount"  :parse="parseCurrency" :format="formatCurrency"  :show-button="false" disabled>
								<template #prefix>
								RM
								</template>
							</n-input-number>
							</n-form-item>
						</n-gi>
						</n-grid>
						<!--Disburse Schedular Payment/Date-->
						<!-- <p class="text-lg font-bold mb-2">Schedular Details</p> -->
						<n-grid x-gap="22" :cols="4" class="py-1">
							<n-gi><p class="text-black text-sm -mt-3">Schedular Amount</p></n-gi>
							<n-gi><p class="text-black text-sm -mt-3">Payment Date</p></n-gi>
						</n-grid>
						<!--Dynamic Input-->
						<template v-for="(installment, index) in showProgramView.installment_data" :key="index">
							<n-grid x-gap="22" :cols="4" class="py-1">
								<n-gi>
									<n-input-number class="w-full" :value="installment.amount" :parse="parseCurrency" :format="formatCurrency" :show-button="false" disabled>
									<template #prefix>
										RM
									</template>
									</n-input-number>
								</n-gi>
								<n-gi>
									<n-input class="w-1/2" disabled :value="installment.payment_date" />
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
							<n-input-number class="w-full" v-model:value="showProgramView.disburse_amount" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" disabled>
								<template #prefix>
								RM
								</template>
							</n-input-number>
							</n-form-item>
						</n-gi>
						</n-grid>
						<!--Disburse Schedular Payment/Date-->
						<n-grid x-gap="22" :cols="4" class="py-1">
							<n-gi><p class="text-black text-sm -mt-3">Batch Name</p></n-gi>
							<n-gi><p class="text-black text-sm -mt-3">Payment Date</p></n-gi>
						</n-grid>
						<template v-for="(installment, index) in showProgramView.installment_data" :key="index">
							<n-grid x-gap="22" :cols="4" class="py-1">
								<n-gi>
									<n-input class="w-1/2" disabled :value="installment.name" />
								</n-gi>
								<n-gi>
									<n-input class="w-1/2" disabled :value="installment.payment_date" />
								</n-gi>
							</n-grid>
						</template>
					</template>
					<!--Program Info-->
					<div class="flex justify-between items-end">
						<div>
							<n-card :bordered="false" style="background-color: #e2e2e2;" hoverable>
								<!--CreatedBy-->
								<n-grid x-gap="22" :cols="2">
									<n-gi>
										<h6>Created By</h6>
									</n-gi>
									<n-gi>
										<h6>{{ showProgramView.created_by }}</h6>
									</n-gi>
								</n-grid>
								<!--CreatedDate-->
								<n-grid class="mb-1.5" x-gap="22" :cols="2">
									<n-gi>
										<h6>Created Date</h6>
									</n-gi>
									<n-gi>
										<h6>{{ showProgramView.created_date }}</h6>
									</n-gi>
								</n-grid>
								<!--Status-->
								<n-grid x-gap="22" :cols="2">
									<n-gi>
										<h6 class="font-bold">Status</h6>
									</n-gi>
									<n-gi>
										<h6 class="font-bold">{{ showProgramView.status }}</h6>
									</n-gi>
								</n-grid>
							</n-card>
						</div>
						<div class="flex justify-end  space-x-3">
							<n-button @click="showSingleReject = true" type="error" style="width: 80px;">
								Reject
							</n-button>
							<n-button @click="showSingleEndorse = true" type="primary" style="width: 80px;">
								Endorse
							</n-button>
						</div>
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
						@positive-click="singleRecommendConfirm(checkID)"
						@negative-click="singleRecommendCancel(checkID)"
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
						@positive-click="singleRejectConfirm"
						@negative-click="singleRejectCancel"
					/>
				</n-form>
			</n-card>
			</n-modal>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, h, reactive, computed } from "vue";
import { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NInputNumber, NGrid, NGi, useMessage, NIcon } from "naive-ui"
import axios from 'axios'
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';
import MdAddCircleOutline from "@vicons/ionicons4/MdAddCircleOutline";
import Add12Filled from "@vicons/fluent/Add12Filled";
import MdSearch from "@vicons/ionicons4/MdSearch";
import { format } from 'date-fns';

const showProgram = ref(false);
const installment_data = ref([]);

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
	dynamicInputValue: [],
	// recommend_by_id: userId
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
	// console.log('here', selectedProgramId)
	let url = import.meta.env.VITE_BACKEND_URL +`/api/programs/show/${id}`;

	try {
	const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
	console.log(response);

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
	showProgramView.created_date = formatDate(programData.created_at) || null;
	showProgramView.status = programData.status.name || null;
	showProgramView.created_by = programData.created_by.name || null;

	if (response && response.data && response.data.installmentPrograms) {
		showProgramView.installment_data = response.data.installmentPrograms.map(installment => ({
		amount: installment.amount || null,
		payment_date: installment.payment_date || null,
		name: installment.name || null,
	}));
	// console.log('checkvalue', showProgramView.installment_data);

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
			const formattedAmount = row.disburse_amount !== null ? `RM ${row.disburse_amount}` : '-';
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
	// const userId = localStorage.getItem('userId');

	const checkedRowKeys = ref([]);
	const recommendations = ref([])

	const message = useMessage();
    const showEndorseRef = ref(false);
	const showRejectRef = ref(false);
	const showSingleEndorseRef = ref(false);
	const showSingleRejectRef = ref(false);

	const rowKey = (row) => row.id;

	const handleCheck = (keys) => {
      checkedRowKeys.value = keys;
    };

	const handleEndorseClick = async () => {
	};

	const getRecommendations = async () => {
		try {
			const url = import.meta.env.VITE_BACKEND_URL +'/api/programs/recommendation'
			const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
			recommendations.value = response.data.recommendations
			console.log(recommendations.value)
		} catch (error) {
			console.error(error)
		}
	}

	getRecommendations()
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
		MdSearch,
		MdAddCircleOutline,
		Add12Filled,
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
		showSingleEndorse: showSingleEndorseRef,
        showSingleReject: showSingleRejectRef,
		singleRecommendConfirm() {
		try {
				const programId = selectedProgramId;
				const userId = localStorage.getItem('userId');

                console.log('selected IDs:', programId, userId);

				axios.put(import.meta.env.VITE_BACKEND_URL +'/api/programs/singleRecommendation', { programId, userId }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
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
			showProgram.value = false;
			} catch (error) {
			console.error(error);
			message.error("Error submitting. Please try again.");
			}
		},
        singleRecommendCancel() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
        singleRejectConfirm() {
			showProgram.value = false;
			try {
				const programId = selectedProgramId;
				const userId = localStorage.getItem('userId');

                console.log('selected IDs:', programId, userId);

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
						axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/programs/singleRejectSubmit`, { programId, text}, {
							headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
						})
						.then((response) => {
							console.log('User confirmed with reason:', text);
							console.log('Update Status Response:', response.data);

							Swal.fire({
								width: 400,
								html: '<span class="text-sm">Program has successfully rejected!</span>',
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
						showProgram.value = false;
					} else if (dismiss === Swal.DismissReason.cancel) {
						showRejectRef.value = false;
						showProgram.value = true;
					}
				});
			} catch (error) {
				console.error(error);
				message.error("Error submitting. Please try again.");
			}
		},
        singleRejectCancel() {
            showRejectRef.value = false;
        },
		showEndorse: showEndorseRef,
        showReject: showRejectRef,
		bulkRecommendConfirm() {
		try {
			const checkedIDs = checkedRowKeys.value;
			const userId = localStorage.getItem('userId');

			console.log('Checked IDs:', checkedIDs);

			if (checkedIDs.length > 0) {
				axios.put(import.meta.env.VITE_BACKEND_URL +'/api/programs/bulkApproveRecommendation', { checkedIDs, userId },{ headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
				.then((response) => {
					console.log('Update Status Response:', response.data);

					Swal.fire({
						width: 380,
						html: '<span class="text-sm">Program has been recommended successfully.</span>',
						icon: 'success',
						confirmButtonText: 'Okay',
						confirmButtonColor: '#3085d6',
						customClass: {
							content: 'text-sm',
							confirmButton: 'px-4 py-2 text-white',
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

			showEndorseRef.value = false;
			} catch (error) {
			console.error(error);
			message.error("Error submitting. Please try again.");
			}
		},
        bulkRecommendCancel() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
        bulkRejectConfirm() {
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
					axios.put(import.meta.env.VITE_BACKEND_URL + '/api/programs/bulkRejectRecommendation', { checkedIDs, userId, text }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
						.then((response) => {
						console.log('Update Status Response:', response.data);

						Swal.fire({
							width: 400,
							html: '<span class="text-sm">Program Has Successfully Been Rejected!</span>',
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
        bulkRejectCancel() {
            message.success("Cancel");
            showRejectRef.value = false;
        },
		columns: createColumns({
			play(row) {
			message.info(`Play ${row.title}`);
			}
		}),
		recommendations,
		dataTableInst: dataTableInstRef,
		pagination,
    };
  }
});
</script>
