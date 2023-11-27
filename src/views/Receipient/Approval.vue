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
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, h, reactive } from "vue";
import {NDataTable, NButton, NSpace, NIcon, NInput, NModal, useMessage} from "naive-ui"
import axios from 'axios'
import MdAddCircleOutline from "@vicons/ionicons4/MdAddCircleOutline";
import Add12Filled from "@vicons/fluent/Add12Filled";
import MdSearch from "@vicons/ionicons4/MdSearch";
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';
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
            onClick: () => play(row)
            },
            { default: () => "View" }
        );
        }
    }
];
 
const dataTableInstRef = ref(null)

export default defineComponent({
	components: {NDataTable, NButton, NSpace, NIcon, NInput, NModal},
  setup() {
	const checkedRowKeys = ref([]);
	const approvals = ref([])

    const message = useMessage();
    const showApproveRef = ref(false);
	const showRejectRef = ref(false);

	const getApprovals = async () => {
		try {
			const url = 'http://127.0.0.1:8000/api/receipients/approval'
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
				axios.put('http://127.0.0.1:8000/api/receipients/approve', { checkedIDs })
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
