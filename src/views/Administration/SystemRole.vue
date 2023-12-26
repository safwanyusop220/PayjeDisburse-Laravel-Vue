<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">SYSTEM ROLE</p>
        <div class="flex justify-between">
            <n-input class="mr-[300px]" v-model:value="searchQuery" placeholder="Search">
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
                    title="Create Role"
                    :bordered="false"
                    size="huge"
                    role="dialog"                    
                    :style="{background: 'white'}"
                  >
                    <n-form
                        :model="role"
                        @submit="submitForm"
                        :label-placement="placement"
                        require-mark-placement="right-hanging"
                        label-width="auto"
                      >
                        <!--Role Name-->
                        <n-grid x-gap="22" :cols="2">
                          <n-gi>
                            <n-form-item label="Roles Name">
                              <n-input  v-model:value="role.name" placeholder="Name"/>                              
                            </n-form-item>
                          </n-gi>
                          <n-gi>
                            <n-form-item label="Roles Description">
                              <n-input v-model:value="role.description" placeholder="Description"/>
                            </n-form-item>
                          </n-gi>
                        </n-grid>

                        <!--Permission-->
                        <!-- <n-card  class="mb-4" size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }"> -->
                          <!-- <n-checkbox size="small" label="All Access" @click="value = !value"/> -->
                        <!-- </n-card> -->

                        <n-grid x-gap="15" y-gap="15" class="mb-5" :cols="3">
                          <template v-for="(permissionsGroup, groupId) in permissions" :key="groupId">
                            <n-gi>
                              <n-card size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }" >

                                <p class="font-bold text-black">{{ permissionsGroup[0].group_name }}</p>

                                <template v-for="permission in permissionsGroup" :key="permission.id">
                                    <n-checkbox-group v-model:value="selectedPermissions" @update:value="handleUpdateValue">
                                      <n-checkbox
                                        size="small"
                                        class="ml-2"
                                        :label="lodash.startCase(permission.name)"
                                        :value="permission.id"
                                        v-model:checked="value"
                                      />
                                    </n-checkbox-group>
                                </template>
                              </n-card>
                            </n-gi>
                          </template>
                        </n-grid>

                        <div class="flex justify-end">
                          <n-button @click="submitForm" type="primary">
                            <template #icon>
                              <n-icon>
                                  <PaperPlaneOutline/>
                              </n-icon>
                            </template>
                            Submit
                          </n-button>
                        </div>
                      </n-form>
                  </n-card>
              </n-modal>
            </div>
        </div>
        <n-data-table ref="dataTableInst" :columns="columns" :data="filteredRoles" :pagination="pagination" />

        <n-modal 
          v-model:show="showRole"
          :mask-closable="true"
          >
          <n-card
              style="width: 1000px; margin-top: 50px; margin-bottom: 100px;"
              title="Create Role"
              :bordered="false"
              size="huge"
              role="dialog"                    
              :style="{background: 'white'}"
            >
              <n-form
                  :model="editRole"
                  @submit="submitForm"
                  :label-placement="placement"
                  require-mark-placement="right-hanging"
                  label-width="auto"
                >
                  <!--Role ID-->
                  <input type="hidden" v-model="editRole.id"/>
                  <!--Role Name-->
                  <n-grid x-gap="22" :cols="2">
                    <n-gi>
                      <n-form-item label="Roles Name">
                        <n-input v-model:value="editRole.name"  placeholder="Name"/>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Roles Description">
                        <n-input v-model:value="editRole.description" placeholder="Description"/>
                      </n-form-item>
                    </n-gi>
                  </n-grid>


                  <!--Permission-->
                  <!-- <n-card  class="mb-4" size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">
                    <n-checkbox size="small" label="All Access" @click="value = !value" />
                  </n-card> -->

                  <n-grid x-gap="15" y-gap="15" class="mb-5" :cols="3">
                    <template v-for="(permissionsGroup, groupId) in permissions" :key="groupId">
                      <n-gi>
                        <n-card size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">

                          <p class="font-bold text-black">{{ permissionsGroup[0].group_name }}</p>
                          <!-- <n-checkbox size="small" v-model:checked="value"  :label="permissionsGroup[0].group_name"  /> -->
                          <template v-for="permission in permissionsGroup" :key="permission.id">
                              <n-checkbox-group v-model:value="editRole.selectedPermissions" @update:value="handleUpdateValue">
                                <n-checkbox
                                  size="small"
                                  class="ml-2"
                                  :label="lodash.startCase(permission.name)"
                                  :value="permission.id"
                                  v-model:checked="value"
                                />
                              </n-checkbox-group>
                          </template>
                        </n-card>
                      </n-gi>
                    </template>
                  </n-grid>

                  <div class="flex justify-end">
                    <n-button @click="update" type="primary">
                      Update
                    </n-button>
                  </div>
                </n-form>
            </n-card>
        </n-modal>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h, computed } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NCheckbox, useMessage, NCheckboxGroup  } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";
import { format } from 'date-fns';
import IosEye from "@vicons/ionicons4/IosEye";
import NotepadEdit16Filled from "@vicons/fluent/NotepadEdit16Filled";
import Delete24Filled from "@vicons/fluent/Delete24Filled";
import { PaperPlaneOutline } from '@vicons/ionicons5'
import Swal from 'sweetalert2';
import lodash from 'lodash'
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

const dataTableInstRef = ref(null)

export default defineComponent({
  components: { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NCheckbox, NCheckboxGroup, PaperPlaneOutline },
    setup() {
      const roles = ref([])
      const showModalRef = ref(false);
      const permissions = ref([])
      const selectedPermissionsRef = ref(null);
      const showRole = ref(false);

      console.log(lodash.startCase('panel_bank'))

      const formatDate = (date) => {
        return date ? format(new Date(date), 'dd/MM/yyyy') : null;
      };

      const getRoles = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/roles/all/roles'
            const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            roles.value = response.data.roles.map(role => {
              // Convert created_at to a Date object
              const createdAtDate = new Date(role.created_at);
              const formattedDate = (createdAtDate.toISOString().split('T')[0]);

              return {
                ...role,
                createdDate: formattedDate
              };
            });
            // console.log(roles.value)
        } catch (error) {
            console.error(error)
        }
      }

      const searchQuery = ref('');
      const filteredRoles = computed(() => {
        const lowerSearchQuery = searchQuery.value.toLowerCase();
        return roles.value.filter(role => 
        role.createdDate.toLowerCase().includes(lowerSearchQuery) ||
        role.name.toLowerCase().includes(lowerSearchQuery) ||
        role.description.toLowerCase().includes(lowerSearchQuery)
        );
      });

      getRoles()

      const getPermissions = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL + '/api/roles/rolePermission';
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            roles.value = response.data.roles;
            permissions.value = response.data.permissions;
            roles.value = response.data.roles.map(role => {
              const createdAtDate = new Date(role.created_at);
              const formattedDate = formatDate(createdAtDate.toISOString().split('T')[0]);

              return {
                ...role,
                createdDate: formattedDate
              };
            });

        } catch (error) {
            console.error(error);
        }
      };
      getPermissions()

      const role = ref({
        name: "",
        description: ""     
      });


      const editRole = reactive({
        id: '',
        name: '',
        description: '' ,
        selectedPermissions: []
      });

      const submitForm = async () => {
        try {
          const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/roles/storeRole',
            {
              name: role.value.name,
              description: role.value.description,
              permissions: selectedPermissionsRef.value,
            },
            {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            }
          );

          console.log('API response:', response.data);

          if (response.data.code === 200) {
            Swal.fire({
              width: 380,
              html: '<span class="text-sm">Role has created successfully.</span>',
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
            }).then((result) => {
              if (result.isConfirmed) {
                showModalRef.value = true;
              }
            });
            
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'An error occurred while creating the role.',
            });
          }

          showModalRef.value = false;
        } catch (error) {
          console.error('API error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred while creating the role.',
          });
        }
      };

      const edit = async (id) => {
        showRole.value = true;

        let url =import.meta.env.VITE_BACKEND_URL +`/api/roles/selectedRole/${id}`;
        try {
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            console.log("here",response);
            editRole.id = response.data.id || null;
            editRole.name = response.data.name || null;
            editRole.description = response.data.description || null;

            editRole.selectedPermissions = response.data.permissions || null;
            const permissionData = response.data.permissions;

            if (permissionData && permissionData.length > 0) {
                const permissionIds = permissionData.map(permission => permission.id);
                // console.log(permissionIds);

                selectedPermissionsRef.value = permissionIds
                // console.log(selectedPermissionsRef)

                editRole.selectedPermissions = permissionIds;
            } else {
                console.log('No permissions found for the selected role.');
                editRole.selectedPermissions = null;
            }

        } catch (error) {
            console.error(error);
        }
      }

      const update = async () => {
        console.log('Form data:', editRole);
        const selectedRoleID = editRole.id;

        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/roles/update/${selectedRoleID}`,
            {
              name: editRole.name,
              description: editRole.description,
              permissions: selectedPermissionsRef.value,
            },
            {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            }
          );

          console.log('API response:', response.data);

          if (response.data.code === 200) {
            Swal.fire({
              width: 380,
              html: '<span class="text-sm">Role updated successfully.</span>',
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
            }).then((result) => {
              if (result.isConfirmed) {
                showRole.value = true;
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'An error occurred while updating the role.',
            });
          }
          showRole.value = false;

        } catch (error) {
          console.error('API error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred while updating the role.',
          });
        }
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
        //Created Date
        {
          title: "Created Date",
          key: "createdDate",
          resizable: true,
          minWidth: 130,
        },
        //Name
        {
          title: "Roles Name",
          key: "name",
          resizable: true,
          minWidth: 130,
        },
        //Description
        {
          title: "Roles Description",
          key: "description",
          resizable: true,
          minWidth: 130,
        },
        //Guard Name
        // {
        //   title: "Guard Name",
        //   key: "guard_name",
        //   resizable: true,
        //   minWidth: 130,
        // }
        //Action
        {
          title: "Action",
          key: "id",	 
          align: "center",
          width: 90,
          render(row) {
            return h(
              "div",
              { class: "space-x-1" },
              [
                h(
                NIcon,
                {
                  size: "large",
                  onClick: () => edit(row.id),
                  class: "cursor-pointer text-yellow-500 hover:text-yellow-700"
                },
                () => h(NotepadEdit16Filled)
                )
              ]
            );
          }
        }
        ];

      return {
        lodash,
        searchQuery,
        filteredRoles,
        update,
        editRole,
        showRole,
        value: ref(false),
        indeterminate: ref(false),
        selectedPermissions: selectedPermissionsRef,
        handleUpdateValue(value) {
          selectedPermissionsRef.value = value;
          console.log(selectedPermissionsRef.value)
        },
        permissions,
        submitForm,
        role,
        placement: ref("top"),
        showModal: showModalRef,
        IosEye,
        Delete24Filled,
        NotepadEdit16Filled,
        MdSearch,
        Add12Filled,
        dataTableInst: dataTableInstRef,
        columns,
        roles,
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