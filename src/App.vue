<template>
  <Loading v-if="loading" message="頁面載入中..." />
  <router-view v-else />
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Loading from './components/Loading.vue';

export default {
  components: { Loading },
  setup() {
    const loading = ref(false);
    const router = useRouter();

    router.beforeEach((_to, _from, next) => { //enter loading before any page load
      loading.value = true;
      next();
    });

    router.afterEach(() => { //leave loading
      loading.value = false;
    });

    return { loading };
  }
};
</script>