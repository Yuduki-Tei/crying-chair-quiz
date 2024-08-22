<template>
  <Quiz v-if="catSelected" :pageTitle="`${selectedCategory}十題`" :qType="selectedCategory" />
  <div
    class="container justify-content-center pt-5 mt-5"
    style="max-width: 450px"
  >
    <div v-if="!catSelected" class="row g-0 text-center">
      <div v-for="(category, _) in categories" :key="category" class="col-md-6">
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{ 'active': selectedCategory === category }"
            @click="selectCategory(category)"
          >
            {{ category }}
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!catSelected" class="mt-3 text-center">
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
import { defineComponent, ref } from "vue";
import Quiz from "../components/Quiz.vue";

export default defineComponent({
  name: "Cat_10",
  components: { Quiz },
  setup() {
    const catSelected = ref<boolean>(false);
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

    return {
      catSelected,
      selectedCategory,
      categories,
      selectCategory,
      changeSelectStatus,
    };
  },
});
</script>