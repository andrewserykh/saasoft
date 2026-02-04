import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Account } from '@/types/account.types'

export const useAccountsStore = defineStore('accounts', () => {
  // state
  const accounts = ref<Account[]>(
    JSON.parse(localStorage.getItem('accounts') ?? '[]')
  )

  watch(
    accounts,
    (value) => {
      localStorage.setItem('accounts', JSON.stringify(value))
    },
    { deep: true }
  )

  // actions
  function addAccount(payload: Account) {
    accounts.value.push(payload)
  }

  function updateAccount(index: number, payload: Partial<Account>) {
    accounts.value[index] = {
      ...accounts.value[index],
      ...payload,
    } as Account
  }

  function deleteAccount(index: number) {
    accounts.value.splice(index, 1)
  }

  function setAccounts(value: Account[]) {
    accounts.value = value
  }

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    setAccounts,
  }
})
