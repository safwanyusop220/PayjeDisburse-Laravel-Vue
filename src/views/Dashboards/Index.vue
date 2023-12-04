<template>
<n-space vertical :size="12">
	<CardCombo5 size="large" class="mb-5"/>
        <div class="mb-5 card-row flex lg:flex-row flex-col gap-5 ">
			<div class="card-wrap lg:basis-1/2 basis-full flex xs:flex-row flex-col gap-5">
				<div class="flex lg:basis-1/2 basis-full">
					<CardCombo2
						title="New Program"
						centered
						class="h-full !text-white !bg-blue-300">
						<template #icon>
							<CardComboIcon :iconName="ReportsIcon" boxed :boxSize="50" :color="'white'"></CardComboIcon>
						</template>
					</CardCombo2>
				</div>
				<div class="flex lg:basis-1/2 basis-full">
					<div class="flex flex-col gap-5 w-full">
						<CardCombo2 title="Pending" horizontal>
							<template #icon>
								<CardComboIcon
									:iconName="PendingIcon"
									:boxSize="50"
                                    boxed
								></CardComboIcon>
							</template>
						</CardCombo2>
                        <CardCombo2 title="Recommended" horizontal>
							<template #icon>
								<CardComboIcon
									:iconName="ShippedIcon"
									:boxSize="50"
                                    boxed>
                                </CardComboIcon>
							</template>
						</CardCombo2>
					</div>
				</div>
			</div>
			<div class="card-wrap lg:basis-1/2 basis-full flex xs:flex-row flex-col gap-5">
				<div class="flex lg:basis-1/2 basis-full">
					<div class="flex flex-col gap-5 w-full">
						<CardCombo2 title="Approved" horizontal>
							<template #icon>
								<CardComboIcon :iconName="CompletedIcon" boxed :boxSize="50"></CardComboIcon>
							</template>
						</CardCombo2>
						<CardCombo2 title="Rejected" horizontal>
							<template #icon>
                                <CardComboIcon
									:iconName="ErrorIcon"
									boxed
									:boxSize="50"
								></CardComboIcon>
							</template>
						</CardCombo2>
					</div>
				</div>
				<div class="flex lg:basis-1/2 basis-full">
					<CardCombo2
						title="New Recipient"
						centered
						class="h-full !text-white !bg-blue-300">
						<template #icon>
							<CardComboIcon :iconName="ReportsIcon" boxed :boxSize="50" :color="'white'"></CardComboIcon>
						</template>
					</CardCombo2>
				</div>
			</div>
		</div>        
		<CardCodeExample title="Bar">
			<template #default="{ style }">
				<Bar :data="data" :options="options" :style="style" />
			</template>
		</CardCodeExample>

		</n-space>
  </template>
  
  <script setup>
  import { defineComponent, ref, watch } from "vue"
  import { useThemeStore } from "@/stores/theme"
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js"
  import { Bar } from "vue-chartjs"

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
	label: "Data One",
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

watch(style, () => {
options.value = getOptions()
})

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
</script>