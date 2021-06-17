<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Расходы по картам</q-toolbar-title>
        <div v-if="!isLoggedIn">
          <q-btn stretch flat to="/login">Войти</q-btn>
        </div>
        <span v-if="isLoggedIn">
          <span v-if="hasPermisson('admin')">
            <q-btn stretch flat to="/stats" label="Показания сенсоров" />
            <q-btn stretch flat to="/events" label="События" />
            <q-btn stretch flat to="/users" label="Пользователи" />
            <q-btn stretch flat to="/apps" label="Приложения" />
            <q-btn-dropdown stretch flat label="Финансы">
              <q-list style="min-width: 100px">
                <q-item clickable to="/spendings">
                  <q-item-section>Все расходы</q-item-section>
                </q-item>
                <q-item clickable to="/postbacks">
                  <q-item-section>Все постбеки</q-item-section>
                </q-item>
                <q-item clickable to="/spendings_by_card">
                  <q-item-section>Расходы по приложениям</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </span>
          <span v-if="hasPermisson('user')">
            <q-btn stretch flat to="/events" label="События" />
            <q-btn stretch flat to="/apps" label="Приложения" />
            <q-btn stretch flat to="/spendings_by_card">Расходы</q-btn>
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
