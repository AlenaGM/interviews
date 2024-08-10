<template>
  <app-dialog />
  <app-progress v-if="isLoading" />
  <app-message v-else-if="!isLoading && !interviews.length" severity="info"
    >{{ t('message.noInterviews') }}
  </app-message>
  <div v-else>
    <h1>{{ t('message.list') }}</h1>

    <div class="flex align-items-center mb-5">
      <div class="flex align-items-center mr-2">
        <app-radio-button
          inputId="interviewResult1"
          name="result"
          value="Reject"
          v-model="selectedFilterResult"
        />
        <label for="interviewResult1" class="ml-2">{{ t('message.reject') }}</label>
      </div>
      <div class="flex align-items-center mr-2">
        <app-radio-button
          inputId="interviewResult2"
          name="result"
          value="Offer"
          v-model="selectedFilterResult"
        />
        <label for="interviewResult2" class="ml-2">{{ t('message.offer') }}</label>
      </div>
      <app-button
        class="mr-2"
        severity="info"
        @click="submitFilter"
        :disabled="!selectedFilterResult"
        >{{ t('message.apply') }}</app-button
      >
      <app-button severity="danger" :disabled="!selectedFilterResult" @click="clearFilter">{{
        t('message.reset')
      }}</app-button>
    </div>

    <app-datatable :value="interviews">
      <app-column field="company" :header="t('message.company')"></app-column>
      <app-column field="hrName" :header="t('message.hrName')"></app-column>
      <app-column field="vacancyLink" :header="t('message.vacancy')">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank" rel="noopener">{{
            t('message.link')
          }}</a>
        </template>
      </app-column>
      <app-column :header="t('message.contacts')">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              rel="noopener"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              target="_blank"
              rel="noopener"
              class="contacts__whatsapp"
            >
              <span class="contacts__icon pi pi-whatsapp"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tel:${slotProps.data.contactPhone}`"
              target="_blank"
              rel="noopener"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </app-column>
      <app-column :header="t('message.passedStages')">
        <template #body="slotProps">
          <span v-if="!slotProps.data.stages">{{ t('message.notFilled') }}</span>
          <div v-else class="interview-stages">
            <app-badge
              v-for="(stage, i) in slotProps.data.stages"
              :key="i"
              :value="i + 1"
              rounded
              v-tooltip.top="stage.name"
            />
          </div>
        </template>
      </app-column>
      <app-column :header="t('message.salary')">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom && !slotProps.data.salaryTo">{{
            t('message.notFilled')
          }}</span>
          <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
        </template>
      </app-column>
      <app-column :header="t('message.result')">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result">{{ t('message.notFilled') }}</span>
          <template v-else>
            <app-badge
              :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
              :value="slotProps.data.result === 'Offer' ? t('message.offer') : t('message.reject')"
            />
          </template>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info" />
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmRemoveInterview(slotProps.data.id)"
            />
          </div>
        </template>
      </app-column>
    </app-datatable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const userStore = useUserStore()
const db = getFirestore()
const confirm = useConfirm()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)
const selectedFilterResult = ref<string>('')

const submitFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews(true)
  interviews.value = listInterviews
  isLoading.value = false
}

const clearFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false
}

const getAllInterviews = async <T extends IInterview>(isFilter?: boolean): Promise<T[]> => {
  let getData

  if (isFilter) {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value)
    )
  } else {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc')
    )
  }

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: t('message.sureToRemove?'),
    header: t('message.removeInterview'),
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('message.cancel'),
    acceptLabel: t('message.remove'),
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true

      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
      const listInterviews: Array<IInterview> = await getAllInterviews()
      interviews.value = [...listInterviews]

      isLoading.value = false
    }
  })
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false
})
</script>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
