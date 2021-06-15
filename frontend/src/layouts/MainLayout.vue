<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="text-black">
        <q-toolbar-title>Компетенции</q-toolbar-title>
        <div v-if="$q.screen.gt.xs">
          <span
            v-if="isLoggedIn && $q.screen.gt.sm"
          >Добро пожаловать, {{ userInfo?.role }} {{ userInfo?.full_name }}</span>
          <span v-if="isLoggedIn">
            <q-btn-dropdown stretch flat label="Компетенции" icon="flag">
              <q-list style="min-width: 100px">
                <q-item clickable to="/competencies">
                  <q-item-section>Список компетенций</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn-dropdown stretch flat label="Информация о школе" icon="school">
              <q-list style="min-width: 100px">
                <q-item clickable to="/users" v-if="hasPermisson(['admin'])">
                  <q-item-section>Пользователи</q-item-section>
                </q-item>
                <q-item clickable to="/triggers">
                  <q-item-section>Триггеры</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn stretch flat @click="logout" to="/login">Выход</q-btn>
          </span>
        </div>
        <div v-else>
          <span v-if="isLoggedIn">
            <q-btn stretch flat icon="menu">
              <q-menu auto-close>
                <q-list style="min-width: 100px">
                  <q-item clickable to="/competencies">
                    <q-item-section>Список компетенций</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable to="/users" v-if="hasPermisson(['admin', 'диспетчер'])">
                    <q-item-section>Сотрудники</q-item-section>
                  </q-item>
                  <q-item clickable to="/school">
                    <q-item-section>Информация о школе</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="logout" to="/login">
                    <q-item-section>Выход</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </span>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useAuth } from '../modules/auth';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false);
    const { isLoggedIn, logout, hasPermisson, userInfo } = useAuth();
    return {
      userInfo,
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
