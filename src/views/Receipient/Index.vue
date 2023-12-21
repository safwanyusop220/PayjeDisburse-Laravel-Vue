<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Receipient</p>

        <div class="flex justify-between">
            <n-input class="mr-[300px]" placeholder="Search">
              <template #prefix>
                <n-icon :component="MdSearch" />
              </template>
            </n-input>
            <div>
              <n-button  @click="showModal = true" type="primary">
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="80" d="M256 112v288"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="80" d="M400 256H112"></path></svg>
                </n-icon>
                Create
              </n-button>
              <n-modal 
                  v-model:show="showModal"
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
                          :model="receipient"
                          @submit="submitForm"
                          :label-placement="placement"
                          :label-align="align"
                          require-mark-placement="right-hanging"
                          label-width="auto">
                            <n-grid x-gap="" :cols="2">
                              <!--Left Data-->
                              <n-gi>
                                <!--Title-->
                                <n-form-item>
                                  <label class="text-xl font-bold text-gray-600 -mb-8">Receipient Details</label>
                                </n-form-item>
                                <!--Name-->
                                <n-form-item label="Receipient Name">
                                  <n-input v-model:value="receipient.name" placeholder="Name"/>
                                </n-form-item>
                                <!--Identification-->
                                <n-form-item label="Identification Number">
                                  <n-input v-model:value="receipient.identification_number" placeholder="Identification"/>
                                </n-form-item>
                                <!--Address-->
                                <n-form-item label="Receipient Address">
                                  <n-input v-model:value="receipient.address" type="textarea" placeholder="Address"/>
                                </n-form-item>
                                <!--Postcode-->
                                <n-form-item label="Postcode Number">
                                  <n-input v-model:value="receipient.postcode" placeholder="Postcode"/>
                                </n-form-item>
                                <!--Phone-->
                                <n-form-item label="Phone Number">
                                  <n-input v-model:value="receipient.phone_number" placeholder="Phone"/>
                                </n-form-item>
                                <!--Email-->
                                <n-form-item label="Email Address">
                                  <n-input v-model:value="receipient.email" placeholder="Email"/>
                                </n-form-item>
                                <!--Bank-->
                                <n-form-item label="Bank Name">
                                  <n-select
                                    v-model:show="showBank"
                                    filterable
                                    v-model:value="receipient.bank_id"
                                    :options="bankOptions"
                                    placeholder="Select an option"
                                    >
                                      <template v-if="showBank" #arrow>
                                          <md-search />
                                      </template>
                                  </n-select>
                                </n-form-item>
                                <!--Account Number-->
                                <n-form-item label="Account Number">
                                  <n-input v-model:value="receipient.account_number" placeholder="Account"/>
                                </n-form-item>
                                <!--Program-->
                                <n-form-item label="Program Name">
                                  <n-select
                                    v-model:show="showProgram"
                                    filterable
                                    v-model:value="receipient.program_id"
                                    :options="programOptions"
                                    placeholder="Select an option"
                                    @update:value="getProgramID"
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
                                <template v-if="showProgramSelected.type == 1">
                                  <!-- <input type="number" v-model="receipient.program_type_id"/> -->
                                  <n-form-item>
                                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                                  </n-form-item>
                                  <n-card :hoverable="true" class="shadow-sm">
                                    <!--Program Type-->
                                    <n-grid x-gap="" :cols="1">
                                      <n-gi>
                                        <n-form-item label="Program Type">
                                          {{ showProgramSelected.typeName }}
                                        </n-form-item>
                                      </n-gi>
                                    </n-grid>
                                    <!--Disburse Amount-->
                                    <n-grid x-gap="" :cols="1">
                                      <n-gi>
                                        <n-form-item label="Disburse Amount">
                                          <n-input-number v-model:value="receipient.disburse_amount" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Amount">
                                            <template #prefix>
                                              RM
                                            </template>
                                          </n-input-number>
                                        </n-form-item>
                                      </n-gi>
                                    </n-grid>
                                    <!--Frequency-->
                                    <n-grid x-gap="" :cols="1">
                                      <n-gi>
                                        <n-form-item label="Frequency">
                                          <n-radio-group v-model:value="receipient.frequency_id">
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
                                      </n-gi>
                                    </n-grid>

                                    <!--One Time-->
                                    <template v-if="receipient.frequency_id == 1">
                                      <!--Payment Date-->
                                      <n-grid x-gap="" :cols="1">
                                        <n-gi>
                                          <n-form-item label="Payment Date">
                                            <n-input
                                              v-model:value="receipient.payment_date"
                                              type="date"
                                              clearable
                                              placeholder=" "
                                            />
                                          </n-form-item>
                                        </n-gi>
                                      </n-grid>
                                    </template>
                                    
                                    <template v-if="receipient.frequency_id == 2">
                                      <!--Payment Date-->
                                      <n-grid x-gap="" :cols="1">
                                        <n-gi>
                                          <n-form-item label="Payment Date">
                                            <n-input
                                              v-model:value="receipient.payment_date"
                                              type="date"
                                              clearable
                                              placeholder=" "
                                            />
                                          </n-form-item>
                                        </n-gi>
                                      </n-grid>

                                      <!--Total Month-->
                                      <n-grid x-gap="" :cols="1">
                                        <n-gi>
                                          <n-form-item label="Total Month">
                                            <n-input-number v-model:value="receipient.total_month" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Month">
                                            </n-input-number>
                                          </n-form-item>
                                        </n-gi>
                                      </n-grid>

                                      <!--End date-->
                                      <n-grid x-gap="" :cols="1">
                                        <n-gi>
                                          <n-form-item label="End Date">
                                            {{ endMonthDate }}
                                          </n-form-item>
                                        </n-gi>
                                      </n-grid>
                                    </template>
                                    <!--Year-->
                                    <template v-if="receipient.frequency_id == 3">
                                      <!--Payment Date-->
                                      <n-grid x-gap="" :cols="1">
                                        <n-gi>
                                          <n-form-item label="Payment Date">
                                            <n-input
                                              v-model:value="receipient.payment_date"
                                              type="date"
                                              clearable
                                              placeholder=" "
                                            />
                                          </n-form-item>
                                        </n-gi>
                                      </n-grid>
                                      <!--Total Year-->
                                      <n-grid x-gap="" :cols="1">
                                        <n-gi>
                                          <n-form-item label="Total Year">
                                            <n-input-number v-model:value="receipient.total_year" class="w-full" :parse="parseCurrency" :format="formatCurrency"  :show-button="false" placeholder="Year">
                                            </n-input-number>
                                          </n-form-item>
                                        </n-gi>
                                      </n-grid>
                                      <!--End date-->
                                      <n-grid x-gap="" :cols="1">
                                        <n-gi>
                                          <n-form-item label="End Date">
                                            {{ endYearDate }}
                                          </n-form-item>
                                        </n-gi>
                                      </n-grid>
                                    </template>
                                    <!--Multiple-->
                                    <template v-if="receipient.frequency_id == 4">
                                      <p class="mb-3 text-black text-sm">Schedular Payment</p>
                                      <n-dynamic-input
                                        v-model:value="receipient.dynamicInputValue"
                                        class=""
                                        item-style="margin-bottom: -15px;"
                                        :on-create="onCreate"
                                        #="{ index, value }">
                                        <div>
                                          <n-form-item
                                            ignore-path-change
                                            :show-label="false"
                                            size="medium"
                                            :path="`receipient.dynamicInputValue[${index}].payment_date`"
                                            :rule="testValidation">
                                            <n-input
                                              type="date"
                                              v-model:value="receipient.dynamicInputValue[index].payment_date"
                                              placeholder=""
                                              :clearable="true"
                                              @keydown.enter.prevent
                                            />
                                          </n-form-item>
                                        </div>
                                      </n-dynamic-input>
                                    </template>
                                  </n-card>
                                </template>
                                <!--Group-->
                                <template v-if="showProgramSelected.type == 2">
                                  <n-form-item>
                                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                                  </n-form-item>
                                  <n-card :hoverable="true" class="shadow-md">
                                    <n-space class="mt-2" vertical :size="25">
                                      <!--Program Type-->
                                      <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Program Type</n-gi>
                                        <n-gi>{{ showProgramSelected.typeName }}</n-gi>
                                      </n-grid>
                                      <!--Amount Rate-->
                                      <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Amount Rate</n-gi>
                                        <n-gi>RM {{ showProgramSelected.disburse_amount }}</n-gi>
                                      </n-grid>
                                      <!--Frequency-->
                                      <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Frequency</n-gi>
                                        <n-gi>{{ showProgramSelected.frequency }}</n-gi>
                                      </n-grid>
                                      <!--Start Date-->
                                      <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Date Payment</n-gi>
                                        <n-gi>{{ showProgramSelected.payment_date }}</n-gi>
                                      </n-grid>
                                      <template v-if="showProgramSelected.frequency_id != 1">
                                      
                                        <template v-if="showProgramSelected.frequency_id == 2">
                                          <!--Total Month-->
                                          <n-grid x-gap="space-x-12" :cols="2">
                                            <n-gi>Total Month</n-gi>
                                            <n-gi>{{ showProgramSelected.total_month }}</n-gi>
                                          </n-grid>
                                        </template>
                                        <template v-if="showProgramSelected.frequency_id == 3">
                                          <!--Total Month-->
                                          <n-grid x-gap="space-x-12" :cols="2">
                                            <n-gi>Total Year</n-gi>
                                            <n-gi>{{ showProgramSelected.total_year }}</n-gi>
                                          </n-grid>
                                        </template>
                                          <!--End Date-->
                                          <n-grid x-gap="space-x-12" :cols="2">
                                            <n-gi>End Date</n-gi>
                                            <n-gi>test</n-gi>
                                          </n-grid>
                                      </template>
                                      
                                    </n-space>
                                  </n-card>
                                </template>
                                <!--Schedule-->
                                <template v-if="showProgramSelected.type == 3">
                                    <n-form-item>
                                      <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                                    </n-form-item>
                                  <n-card :hoverable="true" class="shadow-md">
                                    <n-space class="mt-2" vertical :size="25">
                                      <!--Program Type-->
                                      <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Program Type</n-gi>
                                        <n-gi>{{ showProgramSelected.typeName }}</n-gi>
                                      </n-grid>
                                      <!--Amount Rate-->
                                      <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Amount Rate</n-gi>
                                        <n-gi>RM {{ showProgramSelected.disburse_amount }}</n-gi>
                                      </n-grid>
                                      <p class="text-black mb-2">Payment Date</p>
                                    </n-space>
                                      <!--Payment Date-->
                                      <template v-for="(installment_program, index) in showProgramSelected.installment_programs" :key="index">
                                        <n-grid class="ml-5 mb-1" :cols="2">
                                            <n-gi>
                                              {{ formatDate(installment_program.payment_date) }}
                                            </n-gi>
                                            <n-gi class="-ml-5">
                                              RM {{ installment_program.amount }}
                                            </n-gi>
                                        </n-grid>
                                    </template>
                                  </n-card>
                                </template>
                                <!--Batch-->
                                <template v-if="showProgramSelected.type == 4">
                                  <n-form-item>
                                    <label class="text-xl font-bold text-gray-600 -mb-8">Program Details</label>
                                  </n-form-item>
                                  <n-card :hoverable="true" class="shadow-md">
                                    <n-space class="mt-2" vertical :size="25">
                                      <!--Program Type-->
                                      <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Program Type</n-gi>
                                        <n-gi>{{ showProgramSelected.typeName }}</n-gi>
                                      </n-grid>
                                      <!--Amount Rate-->
                                      <n-grid x-gap="space-x-12" :cols="2">
                                        <n-gi>Amount Rate</n-gi>
                                        <n-gi>RM {{ showProgramSelected.disburse_amount }}</n-gi>
                                      </n-grid>
                                      <p class="text-black mb-2">Payment Date</p>
                                    </n-space>
                                    <!--Payment Date-->
                                    <template v-for="(installment_program, index) in showProgramSelected.installment_programs" :key="index">
                                      <n-grid class="ml-5 mb-1" :cols="2">
                                          <n-gi>
                                            {{ installment_program.name }}
                                          </n-gi>
                                          <n-gi>
                                            {{ formatDate(installment_program.payment_date) }}
                                          </n-gi>
                                      </n-grid>
                                    </template>
                                  </n-card>
                                </template>
                              </n-gi>
                            </n-grid>
                            <div class="flex justify-end">
                              <n-button @click="submitForm" type="primary">
                                Submit
                              </n-button>
                            </div>
                      </n-form>
                  </n-card>
              </n-modal>
            </div>
        </div>
			<n-data-table ref="dataTableInst" :columns="columns" :data="receipients" :pagination="pagination" />
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
              @submit="submitForm"
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
                  <n-card :hoverable="true" class="shadow-md">
                    <n-space class="mt-2" vertical :size="15">
                      <!--Program Type-->
                      <n-grid x-gap="space-x-12" :cols="2">
                        <n-gi>Program Type</n-gi>
                        <n-gi>{{ showReceipientView.typeName }}</n-gi>
                      </n-grid>
                      <!--Amount Rate-->
                      <n-grid x-gap="space-x-12" :cols="2">
                        <n-gi>Amount Rate</n-gi>
                        <n-gi>RM {{ showReceipientView.individual_disburse_amount }}</n-gi>
                      </n-grid>
                      <!--Frequency-->
                      <n-grid x-gap="space-x-12" :cols="2">
                        <n-gi>Frequency</n-gi>
                        <n-gi>{{ showReceipientView.individual_frequency_name }}</n-gi>
                      </n-grid>
                      <!--One Time-->
                      <template v-if="showReceipientView.individual_frequency_id == 1">
                        <!--payment date-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Payment Date</n-gi>
                          <n-gi>{{ showReceipientView.individual_payment_date }}</n-gi>
                        </n-grid>
                      </template>
                      <!--Monthly-->
                      <template v-if="showReceipientView.individual_frequency_id == 2">
                        <!--payment date-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Payment Date</n-gi>
                          <n-gi>{{ showReceipientView.individual_payment_date }}</n-gi>
                        </n-grid>
                        <!--Total Month-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Total Month</n-gi>
                          <n-gi>{{ showReceipientView.individual_total_month }} Months</n-gi>
                        </n-grid>
                        <!--End date-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>End Date</n-gi>
                          <n-gi>{{ showReceipientView.individual_end_date }}</n-gi>
                        </n-grid>
                      </template>
                      <!--Year-->
                      <template v-if="showReceipientView.individual_frequency_id == 3">
                        <!--payment date-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Payment Date</n-gi>
                          <n-gi>{{ showReceipientView.individual_payment_date }}</n-gi>
                        </n-grid>
                        <!--Total Year-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>Total Year</n-gi>
                          <n-gi>{{ showReceipientView.individual_total_year }} Years</n-gi>
                        </n-grid>
                        <!--End date-->
                        <n-grid x-gap="space-x-12" :cols="2">
                          <n-gi>End Date</n-gi>
                          <n-gi>{{ showReceipientView.individual_end_date }}</n-gi>
                        </n-grid>
                      </template>
                      <!--Multiple-->
                      <template v-if="showReceipientView.individual_frequency_id == 4">
                      <!--Shedular-->
                      <n-grid x-gap="space-x-12" :cols="2">
                        <n-gi>Shedular Payment</n-gi>
                        <n-gi>
                          <template v-for="(multiple_date, index) in showReceipientView.individual_multiple_date" :key="index">
                            <div class="mb-1">{{ formatDate(multiple_date.payment_date) }}</div>
                          </template>
                        </n-gi>
                      </n-grid>                        
                      </template>
                    </n-space>
                  </n-card>
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
          </n-form>
        </n-card>
      </n-modal>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h, watch } from "vue"
import { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NRadio, NSelect, NInputNumber, NRadioGroup, NGrid, NGi, useMessage, useDialog, useNotification, NDynamicInput, NIcon } from "naive-ui"
import axios from 'axios'
import { RouterLink } from "vue-router"
import MdSearch from "@vicons/ionicons4/MdSearch";
import MdAddCircleOutline from "@vicons/ionicons4/MdAddCircleOutline";
import Add12Filled from "@vicons/fluent/Add12Filled";
import { format } from 'date-fns';
import IosEye from "@vicons/ionicons4/IosEye";
import NotepadEdit16Filled from "@vicons/fluent/NotepadEdit16Filled";
import Delete24Filled from "@vicons/fluent/Delete24Filled";
import Swal from 'sweetalert2';
import { computed } from "vue";
import dayjs from 'dayjs';

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
  components: { NSpace, NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput,  NSelect, MdSearch, NInputNumber, NRadio, NRadioGroup, NGrid, NGi, NDynamicInput, NIcon},
    setup() {
        const receipients = ref([])
        const programs = ref([])
        const banks = ref([])
        const programOptions = ref([]);
        const bankOptions = ref([]);
        const checkedValueRef = ref(null);
        const checkedValueFrequencyRef = ref(null);
        const showModalRef = ref(false);
        const message = useMessage();
        const dialog = useDialog();
        const modalRef = ref(null);
        const notification = useNotification();
        const showReceipient = ref(false);

        const receipient = ref({
          name: '',
          identification_number: '',
          address: '',
          postcode: '',
          phone_number: '',
          email: '',
          bank_id: '',
          account_number: '',
          program_id: '',
          frequency_id: '',
          payment_date: '',
          type_id: '',
          dynamicInputValue: [],
          program_type_id: '',
          disburse_amount: 0,
          total_month: 0,
          total_year: 0,
          end_date: ''
        });

        const showProgramSelected = reactive({
          name: '',
          type: '',
          disburse_amount: '',
          frequency_id: '',
          frequency: '',
          payment_date: '',
          total_month: '',
          total_year: '',
        });

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
          end_date: '',
          programType_id: '',
          programDisburse_amount: '',
          programFrequency_id: '',
          programFrequency_name: '',
          programPayment_date: '',
          programGroupTotalMonth: '',
          programGroupTotalYear:'',
          individual_multiple_date: []
        });

        const endMonthDate = computed (() => {
          if (receipient.value.payment_date && receipient.value.total_month) {
            return dayjs(receipient.value.payment_date, 'YYYY-MM-DD').add(receipient.value.total_month, 'month').format('DD/MM/YYYY');
          }
          return '';
        });
        
        const endYearDate = computed(() => {
          if (receipient.value.payment_date && receipient.value.total_year) {
            return dayjs(receipient.value.payment_date, 'YYYY-MM-DD').add(receipient.value.total_year, 'year').format('DD/MM/YYYY');
          }
          return '';
        });

        if(endMonthDate.value != null){
          watch(endMonthDate, (newValue) => {
            receipient.value.end_date = newValue;
          });
        }if(endYearDate.value != null)
        {
          watch(endYearDate, (newValue) => {
            receipient.value.end_date = newValue;
          });
        }

        const formatDate = (date) => {
          return date ? format(new Date(date), 'dd/MM/yyyy') : null;
        };

        const submitForm = async () => {
          console.log('Form data:', receipient.value);

          try {
              const response = await axios.post(
                  import.meta.env.VITE_BACKEND_URL + '/api/receipients/store',
                  receipient.value,
                  {
                      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                  }
              );
              console.log('API response:', response.data);
              // Success
              Swal.fire({
                  width: 380,
                  html: '<span class="text-sm">Recipient created successfully.</span>',
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
              showModalRef.value = false;

          } catch (error) {
              console.error('API error:', error.response.data);
              const errorMessage = Object.values(error.response.data.message).join('<br>');
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

              showModalRef.value = false;
          }
        };

        
        const getReceipients = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL +'/api/receipients'
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                receipients.value = response.data.receipients
                // console.log(receipients.value)
            } catch (error) {
                console.error(error)
            }
        }
        getReceipients()

        const getPrograms = async () => {
            try {
                const url = import.meta.env.VITE_BACKEND_URL +'/api/receipients/programs';
                const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                programs.value = response.data.programs;

                programOptions.value = response.data.programs.map(program => ({
                    label: program.name,
                    value: program.id,
                }));

                // console.log(programs.value);
                // console.log(programOptions.value);
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

                // console.log(banks.value);
                // console.log(bankOptions.value);
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
            showProgramSelected.typeName = programData.type.name
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
                let url = import.meta.env.VITE_BACKEND_URL + `/api/receipients/destroy/${id}`;
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

        const view = async (id) => {
          showReceipient.value = true;
          let url = import.meta.env.VITE_BACKEND_URL +`/api/receipients/show/${id}`;
          try {
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            console.log('data',response);

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
            showReceipientView.payment_date = formatDate(receipientData.payment_date) || null;
            showReceipientView.type_id = receipientData.type_id || null;
            showReceipientView.total_month = receipientData.total_month || null;
            showReceipientView.typeName = receipientData.program.type.name || null;
            showReceipientView.programType_id = receipientData.program.type_id || null;
            showReceipientView.programDisburse_amount = receipientData.program.disburse_amount || null;
            showReceipientView.programGroupTotalMonth = receipientData.program.total_month || null;
            showReceipientView.programGroupTotalYear = receipientData.program.total_year || null;
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
              if (receipientData && receipientData.individual_recipient) {
                showReceipientView.individual_disburse_amount = receipientData.individual_recipient.disburse_amount || null;
                showReceipientView.individual_frequency_name = receipientData.individual_recipient.frequency.name || null;
                showReceipientView.individual_frequency_id = receipientData.individual_recipient.frequency.id || null;
                showReceipientView.individual_payment_date = formatDate(receipientData.individual_recipient.payment_date) || null;
                showReceipientView.individual_total_month = receipientData.individual_recipient.total_month || null;
                showReceipientView.individual_total_year = receipientData.individual_recipient.total_year || null;
                showReceipientView.individual_end_date = receipientData.individual_recipient.end_date || null;

                if(receipientData && receipientData.individual_recipient.recipient.schedular){
                  showReceipientView.individual_multiple_date = receipientData.individual_recipient.recipient.schedular || null;
                }
              } else {
                console.log('Individual data is not available.');
              }

              } catch (innerError) {
                console.error('Error handling frequency data:', innerError);
            }

            try {
              if (receipientData && receipientData.program.installment_programs) {
                showReceipientView.installment_programs = receipientData.program.installment_programs
              } else {
                console.log('Frequency data is not available.');
              }

              } catch (innerError) {
                console.error('Error handling frequency data:', innerError);
            }

          } catch (error) {
            console.error(error);
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
          title: "Program Name",
          key: "program.name",
          resizable: true,
          minWidth: 130,
        },
        //Program Type
        {
          title: "Program Type",
          key: "program.type.name",
          resizable: true,
          minWidth: 150,
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
          key: "id",	 
          align: "center",
          width: 120,
          render(row) {
            const isApproved = row.status_id === 2 || row.status_id === 3;
            return h(
              "div",
              { class: "space-x-1" },
              [
              h(
                  NIcon,
                  {
                    size: "large",
                    onClick: () => view(row.id),
                    class: "cursor-pointer text-blue-500 hover:text-blue-700"
                  },
                () => h(IosEye)
                ),
                isApproved
                  ? h(
                      NIcon,
                      {
                        size: "large",
                        type: "warning",
                        class: "cursor-not-allowed text-gray-500"
                      },
                      () => h(NotepadEdit16Filled)
                    )
                  : h(
                      RouterLink,
                      {
                        to: {
                          name: 'Program-Edit',
                          params: { id: row.id } 
                        }
                      },
                      () => h(
                        NIcon,
                        {
                          size: "large",
                          type: "warning",
                          class: "cursor-pointer text-yellow-500 hover:text-yellow-600"
                        },
                        () => h(NotepadEdit16Filled)
                      )
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
        ];
        return {
          endYearDate,
          endMonthDate,
          showReceipientView,
          showReceipient,
          formatDate,
          IosEye,
          Delete24Filled,
          NotepadEdit16Filled,
          Add12Filled,
          MdSearch,
          MdAddCircleOutline,
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
          notify(type) {
            notification[type]({
              content: "What to say?",
              meta: "I don't know",
              duration: 2500,
              keepAliveOnHover: true
            });
          },
          showModaltest: modalRef,
          receipient,
          showProgramSelected,
          submitForm,
          getProgramID,
          programTypes: [
            {
              value: "1",
              label: "Individual"
            },
            {
              value: "2",
              label: "Group"
            },
            {
              value: "3",
              label: "Schedule"
            },
            {
              value: "4",
              label: "Batch"
            }
          ],
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
          showBank: ref(false),
          bankOptions,
          showProgram: ref(false),
          programOptions,
          checkedValue: checkedValueRef,
          handleChange(e) {
            checkedValueRef.value = e.target.value;
          },
          checkedValueFrequency: checkedValueFrequencyRef,
          handleChangeFrequency(e) {
            checkedValueFrequencyRef.value = e.target.value;
          },
          align: ref("left"),
          placement: ref("left"),
          showModal: showModalRef,
          onPositiveClick() {
            message.success("Submit");
            showModalRef.value = false;
          },
          onNegativeClick() {
            message.success("Cancel");
            showModalRef.value = false;
          },
          handleSuccess() {
            dialog.success({
              title: "Success",
              content: "Cool",
              positiveText: "Wow!",
              onPositiveClick: () => {
                message.success("Great!");
              }
            });
          },
          destroy,
          disabled: ref(true),
          receipients,
          columns,
          dataTableInst: dataTableInstRef,
          pagination,
          filterAddress() {
            dataTableInstRef.value.filter({
              address: ["London"]
            })
          },
          sortName() {
            dataTableInstRef.value.sort("name", "ascend")
          },
          clearFilters() {
            dataTableInstRef.value.filter(null)
          },
          clearSorter() {
            dataTableInstRef.value.sort(null)
          },
          // clearForm,
        }
    },
    
})
</script>

<style scoped>
:deep(.slide-left-enter-active),
:deep(.slide-left-leave-active) {
  transition: transform 0.3s ease, opacity 0.3s ease;
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