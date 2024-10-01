<template>
  <Loading v-if="isLoading" message= "test"/>
  <DropDown v-if="!catSelected &&! isLoading"/>
  <Quiz v-if="catSelected &&! isLoading" :pageTitle="`${selectedCategory}十題`" :qType="selectedCategory" />
  <div
    class="container justify-content-center pt-5 mt-5"
    style="max-width: 450px"
  >
    <div v-if="!catSelected &&! isLoading" class="row g-0 text-center">
      <div v-for="(category, _) in categories" :key="category" class="col-md-6">
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{ 'active': selectedCategory === category }"
            @click="selectCategory(category)"
          >
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ category }}</span>
              <span class="badge"> {{getCatCount(category)[1]}} / {{getCatCount(category)[0]}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!catSelected &&! isLoading" class="mt-3 text-center">
      <button @click="changeSelectStatus"
      type="button"
      class="btn btn-primary"
    >
    開始 {{ selectedCategory }} 問題
    </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useOnlineQuestionStore, useLocalQuestionStore, useUserStore } from "../store";
import { fromBase64, getBit } from "../composables";
import Quiz from "../components/Quiz.vue";
import DropDown from "../components/DropDown.vue";
import Loading from "../components/Loading.vue";

export default defineComponent({
  name: "Cat_10",
  components: { Quiz, DropDown, Loading },
  setup() {
    const online = useOnlineQuestionStore();
    const local = useLocalQuestionStore();
    const user = useUserStore();
    const catSelected = ref<boolean>(false);
    const isLoading = ref<boolean>(true);
    const categories = [
      "文學", "語言", "地理", "歷史", "社會",
      "理科", "生活", "運動", "文化", "娛樂"
    ];
    const selectedCategory = ref<string>(categories[0]);

    const selectCategory = (category: string) => {
      selectedCategory.value = category;
    };

    const changeSelectStatus = () =>{
      catSelected.value = true;
    };

    const getCatCount = (cat:string) => {
      let cats = local.getCat(cat) || [];
      let len = cats.length;
      let ansCount = 0;
      let ans = user.dataList.answer_history || "";
      let ansBits = fromBase64(ans);
      cats.forEach(c => {
        if(getBit(ansBits, c) === 1) ansCount ++
      });
      return [len, ansCount]
    };

    onMounted(async () => {
      categories.forEach(async cat => {
         await online.fetchCategoryQids(cat)
      });
      isLoading.value = false;
      
    });

    return {
      isLoading,
      catSelected,
      selectedCategory,
      categories,
      getCatCount,
      selectCategory,
      changeSelectStatus,
    };
  },
});
</script>