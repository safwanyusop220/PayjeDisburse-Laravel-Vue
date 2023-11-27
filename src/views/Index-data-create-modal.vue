<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Bank Panel</p>
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
                          :size="size"
                          :inline="inline"
                          :show-label="showLabel"
                          label-width="auto"
                        >
                          <!--Program Name/Code-->
                          <n-grid x-gap="22" :cols="2">
                            <n-gi>
                              <n-form-item label="Program Name">
                                <n-input class="w-1/2"  placeholder="Name"/>
                              </n-form-item>
                            </n-gi>
                            <n-gi>
                              <n-form-item label="Program Code">
                                <n-input placeholder="Code"/>
                              </n-form-item>
                            </n-gi>
                          </n-grid>
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
        <n-data-table ref="dataTableInst" :columns="columns" :data="bankPanels" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";

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
  components: { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NInput,},
    setup() {
      const bankPanels = ref([])
      const showModalRef = ref(false);


      const getBankPanels = async () => {
            try {
                const url = 'http://127.0.0.1:8000/api/bank-panel'
                const response = await axios.get(url)
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
          title: "Created Date",
          key: "createdDate",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Name
        {
          title: "Holder Name",
          key: "holder_name",
          resizable: true,
          minWidth: 130,
        },
        //Name
        {
          title: "Bank",
          key: "bank.name",
          resizable: true,
          minWidth: 130,
        },
        {
          title: "Account Number",
          key: "account_number",
          resizable: true,
          minWidth: 130,
        },
        //Action
        {
          title: "Action",
          key: "id",	 
          align: "center",
          width: 160, // Adjust the width based on your requirements
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
                  "View"
                ),
                h(
                  RouterLink ,
                  {
                    to: {
                      name: 'Edit', // replace with the name of your edit route
                      params: { id: row.id } // replace 'id' with the parameter your edit route expects
                    }
                  },
                  [
                    h(
                      NButton,
                      {
                        size: "tiny",
                        type: "warning"
                      },
                      "Edit"
                    )
                  ]
                ),
                h(
                  NButton,
                  {
                    size: "tiny",
                    type: "error",
                    onClick: () => destroy(row.id)
                  },
                  "Delete"
                )
              ]
            );
          }
        }
        ];
      return {
        placement: ref("left"),
        showModal: showModalRef,
        MdSearch,
        Add12Filled,
        dataTableInst: dataTableInstRef,
        columns,
        bankPanels,
        pagination
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