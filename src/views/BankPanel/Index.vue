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
                      style="width: 500px; margin-top: 50px; margin-bottom: 100px;"
                      title="Create Bank Panel"
                      :bordered="false"
                      size="huge"
                      role="dialog"                    
                      :style="{background: 'white'}"
                    >
                      <n-form
                          :model="bankPanel"
                          @submit="submitForm"
                          :label-placement="placement"
                          require-mark-placement="right-hanging"
                          label-width="auto"
                        >
                          <!--Holder Name-->
                          <n-form-item label="Holder Name">
                            <n-input v-model:value="bankPanel.holder_name" placeholder="Name"/>
                          </n-form-item>
                          <!--Bank List-->
                          <!--Bank-->
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
                          <!--Account Number-->
                          <n-form-item label="Account Number">
                            <n-input v-model:value="bankPanel.account_number" placeholder="Account"/>
                          </n-form-item>
                          <div class="flex justify-end mt-[24px]">
                            <n-button @click="submitForm" type="primary">
                              Submit
                            </n-button>
                          </div>
                        </n-form>
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
import { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NSelect } from "naive-ui"
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
  components: { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NSelect, MdSearch},
    setup() {
      const bankPanels = ref([])
      const showModalRef = ref(false);
      const banks = ref([])
      const bankOptions = ref([]);

      const bankPanel = ref({
          holder_name: '',
          bank_id: '',
          account_number: '',
      });

      const submitForm = async () => {
        console.log('Form data:', bankPanel.value);
        try {
          const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/bank-panel/store', bankPanel.value, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
          console.log('API response:', response.data);
          showModalRef.value = false;
        } catch (error) {
          console.error('API error:', error);
        }
        window.location.reload();
      };

      const getBankPanels = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL + '/api/bank-panel'
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                bankPanels.value = response.data.bankPanels.map(panel => {
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

      const getBanks = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL + '/api/receipients/banks';
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

      const destroy = async (id) => {
        let url = import.meta.env.VITE_BACKEND_URL +`/api/bank-panel/destroy/${id}`;
        await axios.delete(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(response => {
          if(response.data.code == 200) {
            alert(response.data.message);
            window.location.reload();
            }
        }).catch(error => {
            console.log(error);
        });
      };


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
          width: 160,
          render(row) {
            return h(
              "div",
              { class: "space-x-1" },
              [
                h(
                  RouterLink,
                  {
                    to: {
                      name: 'Bank-Panel-Edit',
                      params: { id: row.id } 
                    }
                  },
                  () => h(
                    NButton,
                    {
                      size: "tiny",
                      type: "warning"
                    },
                    () => "Edit"
                  )
                ),
                h(
                  NButton,
                  {
                    size: "tiny",
                    type: "error",
                    onClick: () => destroy(row.id)
                  },
                  () => "Delete"
                )
              ]
            );
          }
        }
        ];
      return {
        submitForm,
        destroy,
        bankPanel,
        bankOptions,
        showBank: ref(false),
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