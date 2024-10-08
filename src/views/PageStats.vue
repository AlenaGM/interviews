<template>
  <h1>{{ t('message.stats') }}</h1>
  <div class="card flex justify-content-center">
    <app-chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-30rem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const userStore = useUserStore()
const db = getFirestore()
const interviews = ref<IInterview[]>([])
const chartData = ref()
const chartOptions = ref()

onMounted(async () => {
  interviews.value = await getAllInterviews()
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  let getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc')
  )

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body)

  const data: number[] = [0, 0, 0]
  interviews.value.forEach((interview: IInterview) => {
    if (interview.result === 'Offer') {
      data[0]++
    } else if (interview.result === 'Reject') {
      data[1]++
    } else {
      data[2]++
    }
  })

  return {
    labels: [t('message.offer'), t('message.reject'), t('message.inProgress')],
    datasets: [
      {
        data,
        backgroundColor: [
          documentStyle.getPropertyValue('--p-emerald-400'),
          documentStyle.getPropertyValue('--p-rose-400'),
          documentStyle.getPropertyValue('--p-gray-400')
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-emerald-300'),
          documentStyle.getPropertyValue('--p-rose-300'),
          documentStyle.getPropertyValue('--p-gray-300')
        ]
      }
    ]
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          usePointStyle: true,
          color: textColor
        }
      }
    }
  }
}
</script>
