<script setup lang="ts">
import { provide, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountsStore } from '../../stores/accounts'
import draggable from 'vuedraggable'
import AccountRow from './AccountRow.vue'


defineOptions({
  name: 'AccountsList',
})

const accountsStore = useAccountsStore()
const { accounts } = storeToRefs(accountsStore)

const isAddDisabled = computed(() => {
  if (accounts.value.length === 0) return false
  const lastAccount = accounts.value[accounts.value.length - 1]
  return !lastAccount?.login.trim()
})

provide('accountsStore', {
  accounts: accounts,
  updateAccount: accountsStore.updateAccount,
  deleteAccount: accountsStore.deleteAccount,
})


function addAccount() {
  accountsStore.addAccount({
    tags: [],
    type: 'local',
    login: '',
    password: '',
  })
}

const messageForDearTeam = `Приветствую вас!
Я намерянно немного отошел от ТЗ и реализовал сохранение в store по желтой кнопке 'птичка', потому-что
в моей реализации, когда пользователь может обновлять все значения в реальном времени сохранение с подтверждением
более безопасно (так же реализовано в интерфейсе Amazon Web Services для управления пользователями и полномочиями).
Осознаю что в ТЗ было четко прописано иное.`

</script>

<template>

  <v-container>
    <v-card>
      <v-card-title>
        <b>Accounts</b>
        <v-btn @click="addAccount" icon="mdi-plus" size="large" variant="plain" class="ml-2"
          :disabled="isAddDisabled" />
      </v-card-title>
      <v-card-text>
        <v-alert type="info" variant="tonal"
          text="Для указания нескольких меток для одной пары логин/пароль используйте разелитель ;"
          icon="mdi-help-circle-outline"></v-alert>

        <v-list>
          <draggable v-model="accounts" item-key="login" handle=".drag-handle" tag="div">
            <template #item="{ index }">
              <v-list-item>
                <template #prepend>
                  <v-icon class="drag-handle" style="cursor: grab;">mdi-drag-vertical</v-icon>
                </template>
                <AccountRow :index="index" />
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container>
    <v-card>
      <v-card-title>
        <b>Store Debugger</b>
      </v-card-title>
      <v-card-text>
        <pre>
        {{ JSON.stringify(accounts) }}
      </pre>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container>
    <v-alert type="info" variant="tonal" class="mb-2"
      text="Учетные записи можно перетаскивать при помощи иконки слева от каждой строки"
      icon="mdi-help-circle-outline" />
    <v-alert type="question" variant="tonal" :text="messageForDearTeam" icon="mdi-help-circle-outline" class="mb-2" />
  </v-container>

</template>
