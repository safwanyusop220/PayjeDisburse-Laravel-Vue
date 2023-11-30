<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">System User</p>
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
                      title="Create User"
                      :bordered="false"
                      size="huge"
                      role="dialog"                    
                      :style="{background: 'white'}"
                    >
                    <n-scrollbar>
                      <n-form
                          :model="user"
                          @submit="registerUser"
                          :label-placement="placement"
                          require-mark-placement="right-hanging"
                          label-width="auto"
                        >
                          <!--Program Name/Email-->
                          <n-grid x-gap="22" :cols="2">
                            <n-gi>
                              <n-form-item label="Full Name">
                                <n-input v-model:value="user.name" placeholder="Name"/>
                              </n-form-item>
                            </n-gi>
                            <n-gi>
                              <n-form-item label="Email Address">
                                <n-input v-model:value="user.email" placeholder="Email"/>
                              </n-form-item>
                            </n-gi>
                          </n-grid>
                          <n-grid x-gap="22" :cols="2">
                            <!--Password/defaultPassword-->
                            <n-gi>
                              <n-grid x-gap="22" :cols="2">
                                <n-gi>
                                  <n-form-item label="Password">
                                    <n-input type="password" v-model:value="user.password" placeholder="Password"/>
                                  </n-form-item>
                                </n-gi>
                                <n-gi>
                                  <n-form-item>
                                    <div class="border py-2 px-3 rounded-md w-full flex items-center">
                                        <n-checkbox size="medium" class="mr-2"/>
                                        <p class="m-0 text-xs">Default Password</p>
                                    </div>
                                  </n-form-item>
                                </n-gi>
                              </n-grid>
                            </n-gi>
                            <!--Password/defaultPassword-->
                            <n-gi>
                              <n-grid x-gap="22" :cols="2">
                                <n-gi>
                                  <n-form-item label="Role">
                                    <n-input  placeholder="Name"/>
                                  </n-form-item>
                                </n-gi>
                                <n-gi>
                                  <n-form-item>
                                    <div class="border py-2 px-3 rounded-md w-full flex items-center">
                                        <n-checkbox size="medium" class="mr-2"/>
                                        <p class="m-0 text-xs">Define Access</p>
                                    </div>
                                  </n-form-item>
                                </n-gi>
                              </n-grid>
                            </n-gi>
                          </n-grid>
                          <div class="flex justify-end">
                            <n-button @click="registerUser" type="primary">
                              Submit
                            </n-button>
                          </div>
                        </n-form>
                      </n-scrollbar>
                    </n-card>
                </n-modal>
            </div>
        </div>
        <n-data-table ref="dataTableInst" :columns="columns" :data="users" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NScrollbar, NCheckbox } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";
import { useAuthStore } from "@/stores/auth"

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
  components: { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NScrollbar, NCheckbox},
    setup() {
      const users = ref([])
      const showModalRef = ref(false);

      const getUser = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/authentications/user'
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            console.log(response)
            users.value = response.data.users.map(user => {
              const createdAtDate = new Date(user.created_at);
              const formattedDate = createdAtDate.toISOString().split('T')[0];

              return {
                ...user,
                createdDate: formattedDate
              };
            });
        } catch (error) {
            console.error(error)
        }
      }
      getUser()

      const user = ref({
        name: '',
        email: '',
        password: '',
        password_confirmation:''
      });

      const registerUser = async () => {
			console.log('Form data:', user.value);
        try {
          const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/authentications/register', user.value, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
          console.log('API response:', response.data);
          useAuthStore().setLogged()
          window.location.reload();
        } catch (error) {
          console.error('API error:', error);
        }
      }

      const destroy = async (id) => {
        let url = import.meta.env.VITE_BACKEND_URL +`/api/authentications/destroy/${id}`;
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
          title: "Register Date",
          key: "createdDate",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        {
          title: "Email Address",
          key: "email",
          resizable: true,
          minWidth: 200,
        },
        //Name
        {
          title: "Full Name",
          key: "name",
          resizable: true,
          minWidth: 130,
        },
        //Name
        {
          title: "User Roles",
          // key: "bank.name",
          resizable: true,
          minWidth: 130,
        },
        {
          title: "User Status",
          key: "status",
          resizable: true,
          minWidth: 130,
        },
        //Action
        // {
        //   title: "Action",
        //   key: "id",	 
        //   align: "center",
        //   width: 160, // Adjust the width based on your requirements
        //   render(row) {
        //     return h(
        //       "div",
        //       { class: "space-x-1" },
        //       [
        //       h(
        //           NButton,
        //           {
        //             size: "tiny",
        //             type: "info",
        //             onClick: () => view(row.id)
        //           },
        //           "View"
        //         ),
        //         h(
        //           // RouterLink ,
        //           // {
        //           //   // to: {
        //           //   //   name: 'Edit', 
        //           //   //   params: { id: row.id }
        //           //   // }
        //           // },
        //           // [
        //             h(
        //               NButton,
        //               {
        //                 size: "tiny",
        //                 type: "warning"
        //               },
        //               "Edit"
        //             )
        //           // ]
        //         ),
        //         h(
        //           NButton,
        //           {
        //             size: "tiny",
        //             type: "error",
        //             onClick: () => destroy(row.id)
        //           },
        //           "Delete"
        //         )
        //       ]
        //     );
        //   }
        // }
        ];
      return {
        destroy,
        registerUser,
        user,
        placement: ref("top"),
        showModal: showModalRef,
        MdSearch,
        Add12Filled,
        dataTableInst: dataTableInstRef,
        columns,
        users,
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