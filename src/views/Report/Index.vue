<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">Report</p>

		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent } from "vue"
import { NSpace } from "naive-ui"



export default defineComponent({
  components: { NSpace},
    setup() {

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