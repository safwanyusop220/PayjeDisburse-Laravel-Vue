<template>
<n-space vertical :size="12">
	<!-- <CardCombo5 size="large" class="mb-5"/> -->
        <div class="mb-5 card-row flex lg:flex-row flex-col gap-5 ">
			<div class="card-wrap lg:basis-1/2 basis-full flex xs:flex-row flex-col gap-5">
				<div class="flex lg:basis-1/2 basis-full">
					<n-card centered class="h-full !text-white !bg-blue-300">
						<div class="flex justify-center items-center h-full">
							<div>
								<div class="info flex flex-col items-center justify-center">
									<CardComboIcon :class="'text-center'" :iconName="ReportsIcon" boxed :boxSize="50" :color="'white'"></CardComboIcon>
								</div>
								<div class="info flex flex-col">
									<div class="value text-2xl font-bold text-center mt-3">10</div>
									<div class="title text-lg text-center">New Program</div>
								</div>
							</div>
						</div>
					</n-card>
				</div>
				<div class="flex lg:basis-1/2 basis-full">
					<div class="flex flex-col gap-5 w-full">
						<n-card horizontal class="h-full !text-black !bg-white">
							<div class="flex items-center h-full">
								<div class="justify-center">
									<CardComboIcon :iconName="PendingIcon" :boxSize="50" boxed></CardComboIcon>
								</div>
								<div class="info flex flex-col">
									<div class="value text-2xl font-bold text-start ml-4">10</div>
									<div class="title text-md text-start ml-4">Submitted</div>
								</div>
							</div>
						</n-card>
						<n-card horizontal class="h-full !text-black !bg-white">
							<div class="flex items-center h-full">
								<div class="justify-center">
									<CardComboIcon :iconName="CompletedIcon" boxed :boxSize="50"></CardComboIcon>
								</div>
								<div class="info flex flex-col">
									<div class="value text-2xl font-bold text-start ml-4">10</div>
									<div class="title text-md text-start ml-4">Approved</div>
								</div>
							</div>
						</n-card>
					</div>
				</div>
			</div>
			<div class="card-wrap lg:basis-1/2 basis-full flex xs:flex-row flex-col gap-5">
				<div class="flex lg:basis-1/2 basis-full">
					<div class="flex flex-col gap-5 w-full">
						<n-card horizontal class="h-full !text-black !bg-white">
							<div class="flex items-center h-full">
								<div class="justify-center">
									<CardComboIcon :iconName="ShippedIcon" :boxSize="50" boxed></CardComboIcon>
								</div>
								<div class="info flex flex-col">
									<div class="value text-2xl font-bold text-start ml-4">10</div>
									<div class="title text-md text-start ml-4">Recommended</div>
								</div>
							</div>
						</n-card>
						<n-card horizontal class="h-full !text-black !bg-white">
							<div class="flex items-center h-full">
								<div class="justify-center">
									<CardComboIcon :iconName="ErrorIcon" boxed :boxSize="50"></CardComboIcon>
								</div>
								<div class="info flex flex-col">
									<div class="value text-2xl font-bold text-start ml-4">10</div>
									<div class="title text-md text-start ml-4">Rejected</div>
								</div>
							</div>
						</n-card>
					</div>
				</div>
				<div class="flex lg:basis-1/2 basis-full">
					<n-card centered class="h-full !text-white !bg-blue-300">
						<div class="flex justify-center items-center h-full">
							<div>
								<div class="info flex flex-col items-center justify-center">
									<CardComboIcon :class="'text-center'" :iconName="ReportsIcon" boxed :boxSize="50" :color="'white'"></CardComboIcon>
								</div>
								<div class="info flex flex-col">
									<div class="value text-2xl font-bold text-center mt-3">10</div>
									<div class="title text-lg text-center">New Recipient</div>
								</div>
							</div>
						</div>
					</n-card>
				</div>
			</div>
		</div>        
		<CardCodeExample title="Yearly Report">
			<template #default="{ style }">
				<Bar :data="data" :options="options" :style="style" />
			</template>
		</CardCodeExample>

	</n-space>
  </template>
  
<script setup>
import { ref, watch } from "vue"
import { useThemeStore } from "@/stores/theme"
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js"
import { Bar } from "vue-chartjs"
import { NSpace, NCard } from "naive-ui"
const ReportsIcon = "carbon:report"
const ErrorIcon = "carbon:close-outline"
const CompletedIcon = "carbon:checkmark-outline"
const PendingIcon = "carbon:hourglass"
const ShippedIcon = "carbon:send"
const style = useThemeStore().style

const data = {
labels: [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
],
datasets: [
	{
	label: "Disburse",
	backgroundColor: style["--primary-color"],
	data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
	}
]
}

function getOptions() {
return {
	responsive: true,
	maintainAspectRatio: false,
	color: style["--fg-color"],
	scales: {
	y: {
		ticks: { color: style["--fg-secondary-color"] }
	},
	x: {
		ticks: { color: style["--fg-secondary-color"] }
	}
	}
}
}

const options = ref(getOptions())

// watch(style, () => {
// options.value = getOptions()
// })

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
</script>
<style scoped lang="scss">


		.title {
			font-size: 18px;
			word-break: initial;
		}
		.value {
			font-family: var(--font-family-display);
			font-size: 22px;
			font-weight: bold;
			margin-bottom: 6px;
		}
</style>