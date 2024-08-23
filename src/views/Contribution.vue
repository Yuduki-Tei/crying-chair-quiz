<template>
    <DropDown />
    <div class="container px-1 py-1 d-block justify-content-center pt-5" style="max-width: 450px">
        <h2 class="mb-3 fw-normal">題目投稿</h2>
      <form>
        <div class="row mb-3">
          <!-- Main Category Dropdown -->
          <div class="col">
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle w-100"
                type="button"
                id="dropdownCategory"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ selectedCat || "選擇分類" }}
              </button>
              <ul class="dropdown-menu w-100">
                <li v-for="(_, cat) in cats" :key="cat">
                  <a class="dropdown-item" href="#" @click="selectCategory(cat as string)">{{ cat }}</a>
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Subcategory Dropdown -->
          <div class="col">
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle w-100"
                type="button"
                id="dropdownSubcategory"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                :disabled="!subCats.length"
              >
                {{ selectedSubcat || "選擇子分類" }}
              </button>
              <ul class="dropdown-menu w-100">
                <li v-for="subcat in subCats" :key="subcat">
                  <a class="dropdown-item" href="#" @click="selectSubcategory(subcat)">{{ subcat }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        <div class="mb-3">
          <label for="qText" class="form-label">問題本文</label>
          <textarea class="form-control" id="qText" rows="3" required></textarea>
        </div>
        <div class="mb-3">
          <label for="qAnswers" class="form-label">答案</label>
          <input class="form-control" id="qAnswers" required />
        </div>
      </form>
    </div>
  </template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DropDown from "../components/DropDown.vue";

export default defineComponent({
  name: "Contribution",
  components:{ DropDown },
  setup() {
    const cats: { [key: string]: string[] } =  {
        "文學": [
            "中文文學（古典）",
            "中文文學（近代、現代）",
            "西方文學",
            "東方文學",
            "繪本、童話、傳說",
            "中華神話",
            "世界神話",
            "宗教經典",
            "文學（其他）",
            "文學Crossover"
        ],
        "理科": [
            "物理學",
            "化學",
            "數學、電腦科學",
            "醫學、衛生",
            "生物學",
            "動植物",
            "地球科學",
            "天文學",
            "科技、資訊科技",
            "理科（其他）",
            "理科Crossover"
        ],
        "地理": [
            "台灣",
            "大中華地區",
            "日韓",
            "東南亞",
            "中亞、西亞",
            "歐洲",
            "美洲",
            "其他地區",
            "地圖",
            "交通",
            "地理（其他）",
            "地理Crossover"
        ],
        "社會": [
            "政治",
            "台灣社會",
            "法律",
            "經濟",
            "商業、金融",
            "倫理、哲學",
            "心理學、社會學",
            "宗教、神秘學",
            "時事",
            "軍事",
            "社會（其他）",
            "社會Crossover"
        ],
        "生活": [
            "飲食",
            "服飾、時尚",
            "生活",
            "興趣",
            "企業團體",
            "科技、3C",
            "生活（其他）",
            "生活Crossover"
        ],
        "歷史": [
            "台灣歷史",
            "中國歷史（～魏晉南北朝）",
            "中國歷史（隋～清中葉）",
            "中國歷史（清末～）",
            "世界歷史（古代～中世）",
            "世界歷史（近世）",
            "世界歷史（近現代）",
            "歷史（其他）",
            "歷史Crossover"
        ],
        "語言": [
            "台語",
            "諺語、俗語",
            "成語",
            "中文",
            "英文",
            "其他語言",
            "語言學",
            "語言（其他）",
            "語言Crossover"
        ],
        "運動": [
            "個人球類",
            "團體球類",
            "個人非球類",
            "極限運動",
            "格鬥技",
            "健體",
            "電子競技",
            "車輛、動物運動",
            "運動會、運動賽事",
            "運動（其他）",
            "運動Crossover"
        ],
        "文化": [
            "中華文化、風俗",
            "其他文化、風俗",
            "流行文化",
            "樂理、樂器",
            "古典音樂",
            "傳統音樂",
            "平面藝術",
            "立體藝術",
            "文化（其他）",
            "文化Crossover"
        ],
        "娛樂": [
            "動漫畫",
            "遊戲（電子）",
            "遊戲（其他）",
            "影視劇集",
            "電影（台灣）",
            "電影（美國）",
            "電影（其他）",
            "台灣流行音樂",
            "其他流行音樂",
            "娛樂（其他）",
            "娛樂Crossover"
        ]
        };

        const selectedCat = ref<string>('');
        const selectedSubcat = ref<string>('');
        const subCats = ref<string[]>([]);

        const selectCategory = (cat: string) => {
            selectedCat.value = cat;
            subCats.value = cats[cat];
            selectedSubcat.value = ''; // Reset subcategory when category changes
        };

        const selectSubcategory = (subcat: string) => {
            selectedSubcat.value = subcat;
        };

        return {
        cats,
        selectedCat,
        selectedSubcat,
        subCats,
        selectCategory,
        selectSubcategory,
        };
  }
});
</script>