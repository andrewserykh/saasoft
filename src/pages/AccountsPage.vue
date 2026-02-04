<script setup lang="ts">
import { ref, provide } from 'vue'
import AccountsList from '@/widgets/accounts-list/AccountsList.vue';

defineOptions({
  name: 'AccountsPage',
})

const user_id = ref<string | null>(null)



</script>

<template>
  <AccountsList />
</template>

<style lang="css" scoped></style>
