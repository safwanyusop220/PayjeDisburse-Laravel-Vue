<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">System Role Permission</p>
            <div>
              <n-form
                  :model="program"
                  @submit="submitForm"
                  :label-placement="placement"
                  require-mark-placement="right-hanging"
                  label-width="auto"
                >
                  <n-grid x-gap="22" :cols="1">
                    <n-gi>
                      <!--Group Name-->
                      <n-form-item label="Role Name">
                        <n-select
                          v-model:show="showRoles"
                          filterable
                          :options="roleOptions"
                          placeholder="Select an option"
                          >
                            <template v-if="showRoles" #arrow>
                                <md-search />
                            </template>
                        </n-select>
                      </n-form-item>
                    </n-gi>
                  </n-grid>

                  <n-card  class="my-2" size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">
                    <n-checkbox size="small" label="All Access" />
                  </n-card>

                  <n-grid x-gap="10" y-gap="10" class="mb-5" :cols="3">
                      <template v-for="(permissionsGroup, groupId) in permissions" :key="groupId">
                        <n-gi>
                            <n-card size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">
                              <!-- <n-checkbox size="small" :label="permissionsGroup[0].permission_group.name" /> -->
                              <template v-for="(permission, index) in permissionsGroup" :key="index">
                                  <div>
                                    <n-checkbox size="small" :label="permission.name"/>
                                  </div>
                              </template>
                            </n-card>
                          </n-gi>
                      </template>
                  </n-grid>
                  

                  
                  <div class="flex justify-end">
                    <n-button @click="submitForm" type="primary">
                      Submit
                    </n-button>
                  </div>
                </n-form>
            </div>
        <!-- <n-data-table ref="dataTableInst" :columns="columns" :data="roles" :pagination="pagination" /> -->
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NButton, NSelect, NForm, NFormItem, NGrid, NGi, NCheckbox, useMessage, NCard  } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";

export default defineComponent({
  components: { NSpace, NButton, NSelect, NForm, NFormItem, NGrid, NGi, NCheckbox, NCard},
    setup() {

      const message = useMessage();
      const checkedRef = ref(false);
      const roles = ref([])
      const showModalRef = ref(false);
      const roleOptions = ref([]);
      const permissionData = ref([]);
      const permissionsList = ref([]);
      const permissions = ref([])

      const getRoles = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL + '/api/roles/rolePermission';
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            roles.value = response.data.roles;
            permissions.value = response.data.permissions;

            roleOptions.value = response.data.roles.map(role => ({
                label: role.name,
                value: role.id
            }));

        } catch (error) {
            console.error(error);
        }
      };
      getRoles()

      return {
        permissionsList,
        permissions,
        permissionData,
        checked: checkedRef,
        handleCheckedChange(checked) {
          checkedRef.value = checked;
          message.info(JSON.stringify(checked));
        },
        roleOptions,
        showRoles: ref(false),
        placement: ref("top"),
        showModal: showModalRef,
        MdSearch,
        Add12Filled,
        roles,
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