storeq<template>
  <div v-if="dataLoaded">
    <h3 class="m-3 text-center">{{ pageTitle }} <i class = "fs-5"> 總分 : <NumberIncrement :total = total /></i> </h3>
  </div>
  <Loading v-if="!dataLoaded" message = "題目載入中..."/>
  <QuestionDisplay v-if="dataLoaded" />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useResultStore, useQuestionStore, useQuestionStateStore, useUserStore } from "../store";
import QuestionDisplay from "./QuestionDisplay.vue";
import Loading from "./Loading.vue";
import NumberIncrement from "./NumberIncrement.vue";

export default defineComponent({
  name: "Quiz",
  components: { QuestionDisplay, Loading, NumberIncrement },
  props: {
    pageTitle: { type: String },
    qType: { type: String, required: true, default: "" },
  },
  setup(props) {
    //initialize the result and question list
    const res = useResultStore();
    const user = useUserStore();
    const qStore = useQuestionStore();
    const button = useQuestionStateStore();
    const dataLoaded = ref(false);
    const total = computed(() => res.total);

    res.clearDataList();
    res.setType(props.qType);
    res.initDataList();

    button.setType(props.qType);

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      //prevent user from leaving current page
      event.preventDefault();
    };

    onMounted(async () => {
      await user.checkUserAccount();
      await qStore.fetchDataFromDatabase(props.qType);
      dataLoaded.value = true;

      window.addEventListener('beforeunload', handleBeforeUnload);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });
    return { dataLoaded, total };
  },
});
</script>
