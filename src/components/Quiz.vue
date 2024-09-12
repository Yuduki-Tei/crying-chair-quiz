<template>
  <div v-if="dataLoaded">
    <h3 class="m-3 text-center">{{ pageTitle }}</h3>
  </div>
  <Loading v-if="!dataLoaded" />
  <QuestionDisplay v-if="dataLoaded" />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { useResultStore, useOnlineQuestionStore } from "../store";
import QuestionDisplay from "./QuestionDisplay.vue";
import Loading from "./Loading.vue";

export default defineComponent({
  name: "Quiz",
  components: { QuestionDisplay, Loading },
  props: {
    pageTitle: { type: String },
    qType: { type: String, required: true, default: "" },
  },
  setup(props) {
    //initialize the result and question list
    const res = useResultStore();
    const qStatus = useOnlineQuestionStore();
    const dataLoaded = ref(false);

    res.clearDataList();
    res.setType(props.qType);
    res.initDataList();

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      //prevent user from leaving current page
      event.preventDefault();
    };

    onMounted(async () => {
      await qStatus.fetchDataFromDatabase(props.qType);
      dataLoaded.value = true;

      window.addEventListener('beforeunload', handleBeforeUnload);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });
    return { dataLoaded };
  },
});
</script>
