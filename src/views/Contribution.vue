<template>
  <Loading v-if = "loading"/>
  <Agreement />
  <DropDown />
  <div class="container d-block justify-content-center pt-4" style="max-width: 450px">
      <h2 class="fw-normal">題目投稿</h2>
    <form @submit.prevent= "submitForm">
      <div class="row mb-3">
        <!-- Main Category Dropdown -->
        <div class="col">
          <div class="dropdown mt-0">
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
                <a class="dropdown-item" @click="selectCategory(cat as string)">{{ cat }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Subcategory Dropdown -->
        <div class="col">
          <div class="dropdown mt-0">
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
                <a class="dropdown-item" @click="selectSubcategory(subcat)">{{ subcat }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p class = "border-bottom"> {{detail}}</p>
      <div class="mb-3">
        <label for="qText" class="form-label">問題本文</label>
        <textarea class="form-control" id="qText" rows="3" v-model="qText" required />
      </div>
      <div class="mb-3">
        <label for="aText" class="form-label">答案</label>
        <input class="form-control" id="aText" v-model="aText" required />
      </div>
      <button class="btn btn-primary w-100 py-2" type="submit">
          送出投稿
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Loading from "../components/Loading.vue"
import DropDown from "../components/DropDown.vue";
import Agreement from "../components/Agreement.vue";
import { useUserStore } from "../store";

export default defineComponent({
  subCat: "Contribution",
  components:{ DropDown, Agreement, Loading },
  setup() {
    const cats: { [cat: string]: { subCat: string; detail: string }[] } = 
    {'文學': [{'subCat': '中文文學（古典）', 'detail': '與中文古典文學（白話文運動前 ～1910年前）有關的問題。詩詞歌賦一概歸類至此。'}, 
        {'subCat': '中文文學（近代、現代）', 'detail': '與中文文學（白話文運動後 ～1910年後）有關的問題。不分體裁。'}, 
        {'subCat': '西方文學', 'detail': '與西方文學有關的問題（英、美、法、德等）。'}, 
        {'subCat': '東方文學', 'detail': '與日本、印度、中東等中文以外，東方文學有關的問題。不分體裁，動漫等其他分類有關者除外。'}, 
        {'subCat': ' 繪本、童話、傳說', 'detail': '與繪本、童話、民間傳說有關的問題。'}, 
        {'subCat': '中華神話', 'detail': '與中華神話有關的問題。'}, 
        {'subCat': '世界神話', 'detail': '與中華以外神話有關的問題。'}, 
        {'subCat': '宗教經典', 'detail': '宗教故事、宗教中與聖經或經典等文學性較強的問題。'}, 
        {'subCat': '文學（其他）', 'detail': '其他分類到文學的問題。'}, 
        {'subCat': '文學Crossover', 'detail': '與多個主分類或子分類有關，最後分類到文學的問題。'}],
     '理科': [{'subCat': '物理學', 'detail': '與物理學有關的問題。'}, 
        {'subCat': '化學', 'detail': '與化學有關的問題。'}, 
        {'subCat': '數學、電腦科學', 'detail': '與數學、電腦科學有關的問題。'}, 
        {'subCat': '醫學、衛生', 'detail': '與生物病理、疾病、藥物、營養有關的問題。'}, 
        {'subCat': '生物學', 'detail': '與生物生理、生物學有關的問題。'}, 
        {'subCat': '動植物', 'detail': '與生物學以外，動植物有關的問題。'}, 
        {'subCat': '地球科學', 'detail': '與地球歷史（中新世、恐龍等）、地理學（地理形態、自然現象、水文、氣候）等有關的問題。'}, 
        {'subCat': '天文學', 'detail': '與星座、物理學中天文範疇有關的問題。'}, 
        {'subCat': '科技、資訊科技', 'detail': '與科學技術、資訊和通訊科技有關的問題。'}, 
        {'subCat': '理科（其他）', 'detail': '與生活科學、獎項等有關，其他分類到科學的問題。'}, 
        {'subCat': '理科Crossover', 'detail': '與多個主分類或子分類有關，最後分類到科學的問題。'}], 
     '地理': [{'subCat': '台灣', 'detail': '與台灣地理有關的問題。'}, 
        {'subCat': '大中華地區', 'detail': '與中國、香港、澳門等地理有關的問題。'}, 
        {'subCat': '日韓', 'detail': '與日本、韓國、北韓地理有關的問題。'}, 
        {'subCat': '東南亞', 'detail': '與南亞、東南亞地區地理有關的問題。'}, 
        {'subCat': '中亞、西亞', 'detail': '與中亞、西亞地區、蒙古地理相關的問題。'}, 
        {'subCat': '歐洲', 'detail': '與歐洲地理有關的問題。'}, 
        {'subCat': '美洲', 'detail': '與美國、加拿大地理有關的問題。'}, 
        {'subCat': '其他地區', 'detail': '其他與地球其他地區地理有關的問題。'}, 
        {'subCat': '地圖', 'detail': '與大洲、地圖法、地圖等有關的問題。'}, 
        {'subCat': '交通', 'detail': '與鐵路、道路、橋樑、航空器等，交通有關的問題。'}, 
        {'subCat': '地理（其他）', 'detail': '國旗等，其他分類到地理的問題。'}, 
        {'subCat': '地理Crossover', 'detail': '與多個主分類或子分類有關，最後分類到地理的問題。'}], 
     '社會': [{'subCat': '政治', 'detail': '與政治、政治學、政治人物、政治組織等有關的問題。'}, 
        {'subCat': '台灣社會', 'detail': '與本國大學、社會制度、人口、發展規劃等與日常生活較小關係的問題。'}, 
        {'subCat': '法律', 'detail': '與法律條文、法學有關的問題。'}, 
        {'subCat': '經濟', 'detail': '與經濟、經濟學有關的問題。'}, 
        {'subCat': '商業、金融', 'detail': '與股票市場、市場學、管理學、會計學等商科有關的問題。與具體企業名稱有關的問題除外。'}, 
        {'subCat': '倫理、哲學', 'detail': '與倫理學、哲學有關的問題。'}, 
        {'subCat': '心理學、社會學', 'detail': '與心理學、社會學有關的問題。'}, 
        {'subCat': '宗教、神秘學', 'detail': '與教義、宗教儀式、宗教習俗、神秘學（占卜等）有關的問題。'}, 
        {'subCat': '時事', 'detail': '與最近時事有關的問題。'}, 
        {'subCat': '軍事', 'detail': '與軍事有關的問題。'}, 
        {'subCat': '社會（其他）', 'detail': '人類學、海外社會制度等，其他分類到社會的問題。'}, 
        {'subCat': '社會Crossover', 'detail': '與多個主分類或子分類有關，最後分類到社會的問題。'}], 
     '生活': [{'subCat': '飲食', 'detail': '與食物、飲品、料理方法和器具等有關的問題。'}, 
        {'subCat': '服飾、時尚', 'detail': '時尚品牌、服裝、化妝、珠寶、裝扮等，所有時尚有關的問題。'}, 
        {'subCat': '生活', 'detail': '生活物品、生活常識等與生活息息相關的問題。'}, 
        {'subCat': '興趣', 'detail': '園藝、手作、露營等，有關各種興趣的問題。'}, 
        {'subCat': '企業團體', 'detail': '品牌、企業、商品名、非營利組織等，與具體企業/團體有關的問題。'}, 
        {'subCat': '科技、3C', 'detail': '3C產品、家電用品等相關問題'}, 
        {'subCat': '生活（其他）', 'detail': '其他有關日常生活的問題。'}, 
        {'subCat': '生活Crossover', 'detail': '與多個主分類或子分類有關，最後分類到生活的問題。'}],
      '歷史': [{'subCat': '台灣歷史', 'detail': '與台灣歷史人物相關的問題。'}, 
        {'subCat': '中國歷史（～魏晉南北朝）', 'detail': '中國「遠古至魏晉南北朝」歷史、人物相關的問題。'}, 
        {'subCat': '中國歷史（隋～清中葉）', 'detail': '中國「隋唐至清代鴉片戰爭前」歷史、人物相關的問題。'}, 
        {'subCat': '中國歷史（清末～）', 'detail': '中國「清代鴉片戰爭至今」歷史、人物相關的問題。'}, 
        {'subCat': '世界歷史（古代～中世）', 'detail': '文藝復興前，世界其他地區之歷史人物相關的問題。'}, 
        {'subCat': '世界歷史（近世）', 'detail': '文藝復興～第一次工業革命期間，世界其他地區之歷史、人物相關的問題。'}, 
        {'subCat': '世界歷史（近現代）', 'detail': '第一次工業革命後（1840～），世界其他地區之歷史、人物相關的問題。'}, 
        {'subCat': '歷史（其他）', 'detail': '歷史學、考古學等，其他有關歷史的問題。'}, 
        {'subCat': '歷史Crossover', 'detail': '與多個主分類或子分類有關，最後分類到歷史的問題。'}], 
      '語言': [{'subCat': '台語', 'detail': '與台語俗語、諺語、歇後語等有關的問題。'}, 
        {'subCat': '諺語、俗語', 'detail': '在台語以外的語言中，與諺語、俗語有關的問題。'}, 
        {'subCat': '成語', 'detail': '與中文成語有關的問題。'}, 
        {'subCat': '中文', 'detail': '與中文文字、文法有關的問題。'}, 
        {'subCat': '英文', 'detail': '與英文字詞、文法有關的問題。'}, 
        {'subCat': '其他語言', 'detail': '與中英文外其他語言有關的問題。'}, 
        {'subCat': '語言學', 'detail': '與中英文外其他語言文法、語言學有關的問題。'}, 
        {'subCat': '語言（其他）', 'detail': '其他與語言有關的問題。'}, 
        {'subCat': '語言Crossover', 'detail': '與多個主分類或子分類有關，最後分類到語言的問題。'}], 
      '運動': [{'subCat': '個人球類', 'detail': '乒乓球、網球等，單人可進行的球類運動。'}, 
        {'subCat': '團體球類', 'detail': '足球、籃球等，必須以團體形式進行的球類運動。'}, 
        {'subCat': '個人非球類', 'detail': '跳水、田徑、單車、體操等單人非球類運動。'}, 
        {'subCat': '極限運動', 'detail': '登山、攀岩、潛水、跑酷等極限運動。'}, 
        {'subCat': '格鬥技', 'detail': '拳擊、中國武術、劍擊、MMA、摔跤等格鬥運動。'}, 
        {'subCat': '健體', 'detail': '瑜伽、健身、健美、氣功等，與強身健體、鍛煉身體能力有關的運動。'}, 
        {'subCat': '電子競技', 'detail': 'LOL、Dota 2、俄羅斯方塊等電子競技運動。'}, 
        {'subCat': '車輛、動物運動', 'detail': '賽車、賽馬、馬術、賽鴿等運動。'}, 
        {'subCat': '運動會、運動賽事', 'detail': '與奧運會、世界盃、LOL世界大賽特等運動比賽有關的問題。'}, 
        {'subCat': '運動（其他）', 'detail': '其他與運動有關的問題。'}, 
        {'subCat': '運動Crossover', 'detail': '與多個主分類或子分類有關，最後分類到體育的問題。'}], 
      '文化': [{'subCat': '中華文化、風俗', 'detail': '與禮儀、民間習俗、宗教儀式、宗教習俗、曆法等有關的問題。'}, 
        {'subCat': '其他文化、風俗', 'detail': '與中華文化以外地區的禮儀、民間習俗、宗教儀式、宗教習俗、曆法等有關的問題。'}, 
        {'subCat': '流行文化', 'detail': '與網路用語、網路迷因、流行事物等有關的問題。'}, 
        {'subCat': '樂理、樂器', 'detail': '與音樂樂理、樂器有關的問題。'}, 
        {'subCat': '古典音樂', 'detail': '與西方古典音樂有關的問題。'}, 
        {'subCat': '傳統音樂', 'detail': '與童謠、民謠、國歌等各地傳統音樂有關的問題。'}, 
        {'subCat': '平面藝術', 'detail': '與攝影、書法、繪畫、街頭塗鴉等有關的問題。'}, 
        {'subCat': '立體藝術', 'detail': '與雕塑、建築作品、建築様式等有關的問題。'}, 
        {'subCat': '文化（其他）', 'detail': '其他與文化有關的問題。'}, 
        {'subCat': '文化Crossover', 'detail': '與多個主分類或子分類有關，最後分類到文化的問題。'}], 
      '娛樂': [{'subCat': '動漫畫', 'detail': '有關動畫、漫畫、相關作家、特攝作品的問題。'}, 
        {'subCat': '遊戲（電子）', 'detail': '有關電腦遊戲、街機遊戲、主機遊戲等電子遊戲的問題。'}, 
        {'subCat': '遊戲（其他）', 'detail': '有關桌上遊戲、棋類遊戲、團體遊戲（鬼抓人）、個人遊戲（跳格子）等有關的問題。'}, 
        {'subCat': '影視劇集', 'detail': '有關電視劇、電視節目、記錄片等電視媒體有關的問題。'}, 
        {'subCat': '電影（台灣）', 'detail': '有關台灣電影（國片）的問題。'}, 
        {'subCat': '電影（美國）', 'detail': '有關好萊塢、華納兄弟、皮克斯動畫等美國電影的問題。'}, 
        {'subCat': '電影（其他）', 'detail': '有關其他地區出產電影（含非動漫畫改編的動畫電影 eg. 你的名字。）的問題。'}, 
        {'subCat': '台灣流行音樂', 'detail': '有關以作中文、台語為主要語言的歌曲、歌手的問題。'}, 
        {'subCat': '其他流行音樂', 'detail': '其他語言歌曲、歌手的問題。'}, 
        {'subCat': '娛樂（其他）', 'detail': '歌劇等其他有關娛樂的問題。'}, 
        {'subCat': '娛樂Crossover', 'detail': '與多個主分類或子分類有關，最後分類到娛樂的問題。'}]}

        const detail = ref<string>('');
        const selectedCat = ref<string>('');
        const selectedSubcat = ref<string>('');
        const subCats = ref<string[]>([]);
        const qText = ref<string>('');
        const aText = ref<string>('');
        const loading = ref<boolean>(false);

        const user = useUserStore();

        const initRefs = () => {
          detail.value = '';
          selectedCat.value = '';
          selectedSubcat.value = '';
          subCats.value = [];
          qText.value = '';
          aText.value = '';
          loading.value = false;
        }

        const selectCategory = (cat: string) => {
            subCats.value = [];
            detail.value = "";
            selectedCat.value = cat;
            cats[cat].forEach(element => {
              subCats.value.push(element['subCat']);
            });
            selectedSubcat.value = ''; // Reset subcategory when category changes
        };

        const selectSubcategory = (subcat: string) => {
            selectedSubcat.value = subcat;
            cats[selectedCat.value].forEach(element => {
              if (element['subCat'] === subcat){
                detail.value = element['detail']
              }
            });
        };

        const submitForm = () => {
          loading.value = true;
          const formData = new FormData();
          formData.append("entry.2118350034", user.dataList.user_mail);
          formData.append("entry.1527881372", selectedCat.value);
          formData.append("entry.1316067929", selectedSubcat.value);
          formData.append("entry.511086283", qText.value);
          formData.append("entry.586558809", aText.value);
          fetch("https://docs.google.com/forms/d/e/1FAIpQLSeci8E0u9d0RKMtMk8N07bvQ6EPNylzhDY-hKjlDtXblKxIfw/formResponse", {
            method: "POST",
            body: formData,
            mode: "no-cors"
          })
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error("Error submitting form", error);
          });
          setTimeout(() => {
            initRefs();
        }, 1000);
        };

        return {
        cats,
        qText,
        aText,
        detail,
        selectedCat,
        selectedSubcat,
        subCats,
        loading,
        submitForm,
        selectCategory,
        selectSubcategory,
        };
  }
});
</script>