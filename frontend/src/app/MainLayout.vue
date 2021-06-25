<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Умный дом</q-toolbar-title>
        <div v-if="!isLoggedIn">
          <q-btn stretch flat to="/login">Войти</q-btn>
        </div>
        <span v-if="isLoggedIn">
          <span v-if="hasPermisson('admin')">
            <q-btn stretch flat to="/readings" label="Показания сенсоров" />
            <q-btn stretch flat to="/events" label="События" />
            <q-btn stretch flat to="/users" label="Пользователи" />
            <q-btn stretch flat to="/triggers" label="Триггеры" />
          </span>
          <span v-if="hasPermisson('user')">
            <q-btn stretch flat to="/readings" label="Показания сенсоров" />
            <q-btn stretch flat to="/events" label="События" />
          </span>
          <q-btn stretch flat @click="logout" to="/login">Выход</q-btn>
        </span>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useAuth } from './auth/auth';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false);
    const { isLoggedIn, logout, hasPermisson } = useAuth();

    return {
      leftDrawerOpen,
      isLoggedIn,
      logout,
      hasPermisson,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
