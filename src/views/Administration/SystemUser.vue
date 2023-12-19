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
                      <n-form
                          :model="user"
                          @submit="registerUser"
                          :label-placement="placement"
                          require-mark-placement="right-hanging"
                          label-width="auto"
                        >
                          <!--Name/Email-->
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
                          <!--Password/defaultPassword-->
                          <n-grid x-gap="22" :cols="2">
                            <n-gi>
                              <n-grid x-gap="22" :cols="2">
                                <n-gi>
                                  <n-form-item label="Password">
                                    <n-input type="text" v-model:value="user.password" placeholder="Password"/>
                                  </n-form-item>
                                </n-gi>
                                <n-gi>
                                  <n-form-item>
                                    <div class="border py-2 px-3 rounded-md w-full flex items-center">
                                      <n-checkbox
                                        size="small"
                                        label="Default Password"
                                        @update:checked="handleCheckedChange"
                                      />
                                    </div>
                                  </n-form-item>
                                </n-gi>
                              </n-grid>
                            </n-gi>
                            <!--Role/Define Access-->
                            <n-gi>
                              <n-grid x-gap="22" :cols="2">
                                <n-gi>
                                  <!--Role-->
                                  <n-form-item label="Role Name">
                                    <n-select
                                      v-model:show="showRoles"
                                      filterable
                                      :options="roleOptions"
                                      v-model:value="user.role"
                                      placeholder="Select an option"
                                      @update:value="getSelectedRolePermissionById"
                                      >
                                        <template v-if="showRoles" #arrow>
                                            <md-search />
                                        </template>
                                    </n-select>
                                  </n-form-item>
                                </n-gi>
                                <n-gi>
                                  <n-form-item>
                                    <!-- <div class="border py-2 px-3 rounded-md w-full flex items-center">
                                        <n-checkbox size="medium" class="mr-2"/>
                                        <p class="m-0 text-xs">Define Access</p>
                                    </div> -->
                                    <div class="border py-2 px-3 rounded-md w-full flex items-center">
                                      <n-checkbox
                                        v-model:checked="checkedHandleDefineAccess"
                                        label="Custom Access"
                                        @update:checked="handleDefineAccess"
                                        @click="disabled = !disabled"
                                        v-model:value="user.isCustomAccess"
                                      />
                                    </div>
                                  </n-form-item>
                                </n-gi>
                              </n-grid>
                            </n-gi>
                          </n-grid>

                          <!--Permission-->
                          <n-card  class="mb-4" size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">
                            <n-checkbox size="small" label="All Access" @click="value = !value" />
                          </n-card>

                          <n-grid x-gap="15" y-gap="15" class="mb-5" :cols="3">
                            <template v-for="(permissionsGroup, groupId) in permissions" :key="groupId">
                              <n-gi>
                                <n-card size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">

                                  <n-checkbox size="small" v-model:checked="value"  :label="permissionsGroup[0].group_name" :disabled="disabled"/>
                                  <template v-for="permission in permissionsGroup" :key="permission.id">
                                      <n-checkbox-group v-model:value="selectedRolePermissions.selectedPermissions" @update:value="handleUpdateValue" :disabled="disabled">
                                        <n-checkbox
                                          size="small"
                                          class="ml-6"
                                          :label="permission.name"
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
                            <n-button @click="registerUser" type="primary">
                              Submit
                            </n-button>
                          </div>
                        </n-form>
                    </n-card>
                </n-modal>
            </div>
        </div>
        <n-data-table ref="dataTableInst" :columns="columns" :data="users" :pagination="pagination" />
        <!--Edit User-->
        <n-modal 
          v-model:show="showUser"
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
              <n-form
                  :model="editUser"
                  :label-placement="placement"
                  require-mark-placement="right-hanging"
                  label-width="auto"
                >
                  <!--Name/Email-->
                  <n-grid x-gap="22" :cols="2">
                    <n-gi>
                      <n-form-item label="Full Name">
                        <n-input v-model:value="editUser.name" placeholder="Name"/>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Email Address">
                        <n-input v-model:value="editUser.email" placeholder="Email"/>
                      </n-form-item>
                    </n-gi>
                  </n-grid>
                  <!--Password/defaultPassword-->
                  <n-grid x-gap="22" :cols="2">
                    <!--Status-->
                    <n-gi>
                      <n-grid x-gap="22" :cols="1">
                        <n-gi>
                          <n-form-item label="User Status">
                            <n-select
                              filterable
                              placeholder="Select Status"
                              >
                                <template v-if="showRoles" #arrow>
                                    <md-search />
                                </template>
                            </n-select>
                          </n-form-item>
                        </n-gi>
                      </n-grid>
                    </n-gi>
                    <!--Role/Define Access-->
                    <n-gi>
                      <n-grid x-gap="22" :cols="2">
                        <n-gi>
                          <!--Role-->
                          <n-form-item label="Role Name">
                            <n-select
                              v-model:show="showRoles"
                              filterable
                              :options="roleOptions"
                              v-model:value="editUser.role"
                              placeholder="Select an option"
                              @update:value="getSelectedUpdatedRolePermissionById"
                              >
                                <template v-if="showRoles" #arrow>
                                    <md-search />
                                </template>
                            </n-select>
                          </n-form-item>
                        </n-gi>
                        <n-gi>
                          <n-form-item>
                            <!-- <div class="border py-2 px-3 rounded-md w-full flex items-center">
                                <n-checkbox size="medium" class="mr-2"/>
                                <p class="m-0 text-xs">Define Access</p>
                            </div> -->
                            <div class="border py-2 px-3 rounded-md w-full flex items-center">
                              <n-checkbox
                                v-model:checked="checkedHandleDefineAccess"
                                label="Custom Access"
                                @update:checked="handleDefineAccess"
                                @click="disabled = !disabled"
                               
                              />
                            </div>
                          </n-form-item>
                        </n-gi>
                      </n-grid>
                    </n-gi>
                  </n-grid>

                  <!--Permission-->
                  <n-card  class="mb-4" size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">
                    <n-checkbox size="small" label="All Access" @click="value = !value" />
                  </n-card>

                  <n-grid x-gap="15" y-gap="15" class="mb-5" :cols="3">
                    <template v-for="(permissionsGroup, groupId) in permissions" :key="groupId">
                      <n-gi>
                        <n-card size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">
                          <n-checkbox size="small" v-model:checked="value"  :label="permissionsGroup[0].group_name" :disabled="disabled"/>
                          <template v-for="permission in permissionsGroup" :key="permission.id">
                              <!-- <n-checkbox-group v-model:value="editUser.permissions" @update:value="handleUpdateValue" :disabled="disabled">
                                <n-checkbox
                                  size="small"
                                  class="ml-6"
                                  :label="permission.name"
                                  :value="permission.id"
                                  v-model:checked="value"
                                />
                              </n-checkbox-group> -->
                              <n-checkbox-group v-model:value="editUser.selectedPermissions" @update:value="handleUpdateValue" :disabled="disabled">
                                <n-checkbox
                                  size="small"
                                  class="ml-6"
                                  :label="permission.name"
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
import { defineComponent, ref, reactive, h } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NCheckbox, NCheckboxGroup, NSelect, useMessage   } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";
import { useAuthStore } from "@/stores/auth"
import { format } from 'date-fns';
import NotepadEdit16Filled from "@vicons/fluent/NotepadEdit16Filled";
import Delete24Filled from "@vicons/fluent/Delete24Filled";
import Swal from 'sweetalert2';

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
  components: { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NCheckbox, NCheckboxGroup, NSelect, MdSearch },
    setup() {
      const users = ref([])
      const showModalRef = ref(false);
      const roles = ref([])
      const permissions = ref([])
      const selectedPermissionsRef = ref(null);
      const roleOptions = ref([]);
      const defaultPasswordChecked = ref(false);
      const checkedRef = ref(false);
      const showUser = ref(false);

      const message = useMessage();

      const formatDate = (date) => {
        return date ? format(new Date(date), 'dd/MM/yyyy') : null;
      };

      const getUser = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/authentications/user'
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            // console.log(response)
            users.value = response.data.users.map(user => {

              const createdAtDate = new Date(user.created_at);
              const formattedDate = formatDate(createdAtDate.toISOString().split('T')[0]);

              const createdAtTime = new Date(user.created_at);
              const formattedTime = createdAtTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              const customAccess = user.isCustomAccess;
              const roleName = customAccess === 1 ? user.role.name + " (customized)" : user.role.name;

              return {
                ...user,
                createdDate: formattedDate,
                createdTime: formattedTime,
                customAccess: customAccess,
                roleName: roleName,
              };
            });
        } catch (error) {
            console.error(error)
        }
      }
      getUser()

      const getRoles = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/roles/all/roles'
            const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            roles.value = response.data.roles.map(role => {
              // Convert created_at to a Date object
              const createdAtDate = new Date(role.created_at);
              const formattedDate = createdAtDate.toISOString().split('T')[0];

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
      getRoles()

      const getPermissions = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL + '/api/roles/rolePermission';
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            roles.value = response.data.roles;
            permissions.value = response.data.permissions;
            // console.log(response.data.permissions)

            roleOptions.value = response.data.roles.map(role => ({
                label: role.name,
                value: role.id
            }));

        } catch (error) {
            console.error(error);
        }
      };
      getPermissions()

      const user = ref({
        name: '',
        email: '',
        password: '',
        password_confirmation:'',
        isCustomAccess: 0
      });

      const editUser = reactive({
        name: '',
        email: '',
        password: '',
        password_confirmation:'',
        isCustomAccess: '',
        role_id: '',
        selectedPermissions: [],
        permissions: []
      });

      const selectedRolePermissions = reactive({
        selectedPermissions: []
      });

      const getSelectedRolePermissionById = async (id) => {
          try {
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/roles/selectedRole/${id}`, {
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });

              const permissionData = response.data.permissions;

              if (permissionData && permissionData.length > 0) {
                  const permissionIds = permissionData.map(permission => permission.id);
                  // console.log(permissionIds);

                  selectedPermissionsRef.value = permissionIds
                  // console.log(selectedPermissionsRef)

                  selectedRolePermissions.selectedPermissions = permissionIds;
              } else {
                  console.log('No permissions found for the selected role.');
                  selectedRolePermissions.selectedPermissions = null;
              }
          } catch (error) {
              console.error('Error fetching selected role permissions:', error);
          }
      };

      const getSelectedUpdatedRolePermissionById = async (id) => {
          try {
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/roles/selectedRole/${id}`, {
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });

              const permissionData = response.data.permissions;

              if (permissionData && permissionData.length > 0) {
                  const permissionIds = permissionData.map(permission => permission.id);

                  selectedPermissionsRef.value = permissionIds
                  // console.log('new', selectedPermissionsRef)
                  editUser.selectedPermissions = permissionIds;
              } else {
                  console.log('No permissions found for the selected role.');
                  editUser.selectedPermissions = null;
              }
          } catch (error) {
              console.error('Error fetching selected role permissions:', error);
          }
      };

      const handleCheckedChange = (checked) => {
        defaultPasswordChecked.value = checked;
        if (checked) {
          user.value.password = import.meta.env.VITE_DEFAULT_PASSWORD;
        } else {
          user.value.password = '';
        }
      };

      const registerUser = async () => {
			console.log('Form data:', user.value);
        try {
          const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/authentications/register',
          {
            name: user.value.name,
            email: user.value.email,
            isCustomAccess: user.value.isCustomAccess,
            password: user.value.password,
            password_confirmation: user.value.password_confirmation,
            role: user.value.role,
            permissions: selectedPermissionsRef.value,
          },
          { 
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
          });
          console.log('API response:', response.data);
          if (response.data.code === 200) {
              Swal.fire({
                width: 380,
                html: '<span class="text-sm">User has been created successfully.</span>',
                icon: 'success',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#3085d6',
                customClass: {
                  content: 'text-sm',
                  confirmButton: 'px-4 py-2 text-white',
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  useAuthStore().setLogged()
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
                text: 'An error occurred while creating the user.',
              });
            }

            showModalRef.value = false;
          } catch (error) {
            console.error('API error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'An error occurred while creating the user.',
            });
          }
      }

      const edit = async (id) => {
        showUser.value = true;

        let url =import.meta.env.VITE_BACKEND_URL +`/api/authentications/selectedUser/${id}`;

        try {
          const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
          console.log("here",response);
          editUser.id = response.data.id || null;
          editUser.name = response.data.name || null;
          editUser.email = response.data.email || null;
          editUser.role = response.data.role.id || null;
          editUser.roleName = response.data.role.name || null;

          //Initial Permission
          const InitialPermissionData = response.data.permissions;

          if (InitialPermissionData && InitialPermissionData.length > 0) {
              const permissionIds = InitialPermissionData.map(permission => permission.id);

              selectedPermissionsRef.value = permissionIds

              editUser.permissions = permissionIds;
          } else {
              console.log('No permissions found for the selected role.');
              editUser.permissions = null;
          }
          //Selected Permission
          const permissionData = response.data.role.permissions;

          if (permissionData && permissionData.length > 0) {
              const permissionIds = permissionData.map(permission => permission.id);

              selectedPermissionsRef.value = permissionIds

              editUser.selectedPermissions = permissionIds;
          } else {
              console.log('No permissions found for the selected role.');
              editUser.selectedPermissions = null;
          }

        } catch (error) {
            console.error(error);
        }
      }

      const update = async () => {
        console.log('Form data:', editUser);
        const selectedUserID = editUser.id;
        console.log('User ID', selectedUserID);

        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/authentications/updateUserRolePermission/${selectedUserID}`, {
                name: editUser.name,
                email: editUser.email,
                role: editUser.role,
                permissions: selectedPermissionsRef.value,
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('API response:', response.data);
        } catch (error) {
            console.error('API error:', error);
        }
        window.location.reload();
      };


      const destroy = async (id) => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              let url = import.meta.env.VITE_BACKEND_URL + `/api/authentications/destroy/${id}`;
              const response = await axios.delete(url, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
              });

              if (response.data.code === 200) {
                Swal.fire({
                  width: 380,
                  icon: 'success',
                  confirmButtonText: 'Okay',
                  confirmButtonColor: '#3085d6',
                  customClass: {
                    content: 'text-sm',
                    confirmButton: 'px-4 py-2 text-sm text-white rounded',
                  },
                  html: `<span class="text-sm">${response.data.message}</span>`,
                }).then(() => {
                  window.location.reload();
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'An error occurred while deleting.',
                });
              }
            } catch (error) {
              console.error('API error:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while deleting.',
              });
            }
          }
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
        //Register Date
        {
          title: "Register Date",
          key: "createdDate",
          class: "uppercase",
          resizable: true,
          minWidth: 120,
        },
        //Name
        {
          title: "Full Name",
          key: "name",
          resizable: true,
          minWidth: 180,
        },
        //User Roles
        {
          title: "User Roles",
          key: "roleName",
          resizable: true,
          minWidth: 150,
        },
        {
          title: "Email Address",
          key: "email",
          resizable: true,
          minWidth: 200,
        },
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
                ),
                h(
                  NIcon,
                  {
                    size: "large",
                    type: "error",
                    onClick: () => destroy(row.id),
                    class: "cursor-pointer text-red-500 hover:text-red-600"
                  },
                  () => h(Delete24Filled)
                )
              ]
            );
          }
        }
        // {
        //   title: "Log Info",
        //   key: "createdTime",
        //   resizable: true,
        //   minWidth: 120,
        // },
        // {
        //   title: "User Status",
        //   key: "status",
        //   resizable: true,
        //   minWidth: 130,
        // },
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
        update,
        editUser,
        showUser,
        checkedHandleDefineAccess: checkedRef,
        disabled: ref(true),
        handleDefineAccess(checkedHandleDefineAccess) {
          checkedRef.value = checkedHandleDefineAccess;
          if(checkedHandleDefineAccess == true)
          {
            user.value.isCustomAccess = 1;
          }
        },
        selectedRolePermissions,
        getSelectedUpdatedRolePermissionById,
        getSelectedRolePermissionById,
        user,
        handleCheckedChange,
        defaultPasswordChecked,
        roleOptions,
        value: ref(false),
        indeterminate: ref(false),
        selectedPermissions: selectedPermissionsRef,
        handleUpdateValue(value) {
          selectedPermissionsRef.value = value;
          console.log(selectedPermissionsRef.value)
        },
        showRoles: ref(false),
        permissions,
        destroy,
        registerUser,
        placement: ref("top"),
        showModal: showModalRef,
        Delete24Filled,
        NotepadEdit16Filled,
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