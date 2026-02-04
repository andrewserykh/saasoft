<script setup lang="ts">
import { ref, inject, watch, computed, nextTick } from 'vue'
import type { AccountType, Account, AccountTag } from '@/types/account.types'
import { ACCOUNT_TYPE_OPTIONS } from '@/types/account.types'
import { useAccountsStore } from '../../stores/accounts'

defineOptions({
  name: 'AccountRow',
})

const props = defineProps<{
  index: number
}>()

// type AccountsStoreInjected = {
//   accounts: { value: Account[] }
//   updateAccount: (index: number, payload: Partial<Account>) => void
//   deleteAccount: (index: number) => void
// }
// const accountsStore = inject<AccountsStoreInjected>('accountsStore')!

const type = ref<AccountType>('local')
const login = ref<string | null>('')
const password = ref<string | null>('')
const showPassword = ref(false)
const requireUpdate = ref(false)

const accountsStore = useAccountsStore()
const storeAccount = computed(() => {
  return accountsStore.accounts[props.index]
})


const rawTags = ref<Array<string | AccountTag>>([])
const searchInput = ref<string>('')

const tags = computed<AccountTag[]>({
  get() {
    return rawTags.value.map(tag =>
      typeof tag === 'string' ? { text: tag } : tag
    )
  },
  set(value) {
    rawTags.value = value
  },
})



function syncFromStore() {
  if (!storeAccount.value) return

  rawTags.value = [...storeAccount.value.tags]
  type.value = storeAccount.value.type
  login.value = storeAccount.value.login
  password.value = storeAccount.value.password
  requireUpdate.value = false
}

watch(type, (newType) => {
  if (newType === 'ldap') {
    password.value = null
  }
})

watch(
  () => props.index,
  syncFromStore,
  { immediate: true }
)

watch(
  storeAccount,
  syncFromStore,
  { deep: true }
)

watch(
  [tags, type, login, password],
  () => {
    if (!storeAccount.value) return

    const hasRequiredFields = !!login.value && (type.value === 'ldap' || !!password.value)
    const hasChanges = JSON.stringify({
      tags: tags.value,
      type: type.value,
      login: login.value,
      password: password.value,
    }) !==
      JSON.stringify({
        tags: storeAccount.value.tags,
        type: storeAccount.value.type,
        login: storeAccount.value.login,
        password: storeAccount.value.password,
      })

    requireUpdate.value = hasRequiredFields && hasChanges
  },
  { deep: true }
)

function deleteAccount() {
  accountsStore.deleteAccount(props.index)
}

function required(value: string | null) {
  return !!value || 'Обязательное поле'
}

function saveUpdates() {
  accountsStore.updateAccount(props.index, {
    tags: tags.value,
    type: type.value,
    login: login.value,
    password: password.value,
  })

  requireUpdate.value = false
}

const handleTagInput = (event: KeyboardEvent) => {
  if (event.key === ';') {
    event.preventDefault()
    const input = event.target as HTMLInputElement
    const currentValue = input.value
    const value = currentValue.replace(/;$/, '').trim()
    if (value) {
      const exists = rawTags.value.some(tag => {
        const tagText = typeof tag === 'string' ? tag : tag.text
        return tagText === value
      })
      if (!exists) {
        rawTags.value.push({ text: value })
      }
      nextTick(() => {
        searchInput.value = ''
        input.value = ''
      })
    }
  }
}

</script>

<template>
  <v-container style="padding-bottom:6px;">
    <v-row>
      <v-col cols="12" md="5" class="pa-1">
        <v-combobox v-model="rawTags" v-model:search-input="searchInput" label="Метки" multiple chips deletable-chips
          clearable density variant="outlined" item-title="text" item-value="text" return-object
          @keydown="handleTagInput" />
      </v-col>

      <v-col cols="12" md="2" class="pa-1">
        <v-select v-model="type" :items="ACCOUNT_TYPE_OPTIONS" item-title="label" item-value="value" variant="outlined"
          label="Тип аккаунта" />
      </v-col>

      <v-col cols="12" md="2" class="pa-1">
        <v-text-field v-model="login" :rules="[required]" :counter="100" label="Login" required variant="outlined" />
      </v-col>

      <v-col cols="12" md="3" class="pa-1">
        <div class="d-flex">
          <div class="password-wrapper">
            <v-text-field v-show="type !== 'ldap'" v-model="password" :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword" :rules="[required]" :counter="100" label="Password"
              variant="outlined" />
          </div>

          <v-btn @click="deleteAccount" icon="mdi-trash-can" size="large" variant="plain" class="ml-2" />
          <div class="ml-2" style="width: 40px;">
            <v-btn v-if="requireUpdate" @click="saveUpdates" icon="mdi-check-circle" color="amber" size="large"
              variant="plain" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>
.password-wrapper {
  width: 100%;
}
</style>
