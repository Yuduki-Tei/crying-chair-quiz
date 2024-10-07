<template>
  <div
    class="container px-1 py-1 justify-content-center pt-3"
    style="max-width: 450px"
  >
  <h3 class = "text-center border-top border-bottom mb-4">關於題目</h3>
    <p class = "mb-1">1. 愈前面提供的資訊愈困難，愈後面提供的資訊愈簡單。</p>
    <p class = "mb-1">2. 結尾不使用謂語，以可辨識答案類別的名詞或疑問詞結束。</p>
      <ol>為何、是什麼、是誰、哪個國家、哪部作品...</ol>
    <p class = "mb-1">3. 使用正確標點符號與連接詞標記斷句、特殊名詞、引用等。</p>
      <ol>為顧及顯示效果，一律採全形標點。下為本站標準標點，可由此複製<br>
        ， 、 。 ； ： ？ 「 」 『 』 〈 〉 《 》 （ ） ・ ！
      </ol>
    <p class = "mb-1">4. 使用正確的代詞、量詞、助詞。</p>
      <ol>這些都是用於判斷答案的重要線索，用錯字會誤導思維方向</ol>
    <p class = "mb-1">5. 所用詞彙非一般大眾所認知時，以前綴提供詞彙性質。</p>
      <ol>「運動員」某某、「電影」某某、「小說」某某</ol>
    <p class = "mb-1">6. 詞彙無約定俗成之中譯或易有歧異時，可在中文後以（）註記原文。</p>
    <p class = "mb-1">7. 用字精確簡短，所有敘述接與答案相關，不提供無效資訊。</p>
    <p class = "mb-1">8. 長問題在開頭先提示答案類別，在結尾句開頭加上「請問」。</p>
    <p class = "mb-1">9. 短且直接的問題在開頭加上「請問」。</p>
    <p class = "mb-1">10. 事物之固有、習慣、合乎邏輯之排序，非必要不做更動。</p>
    <p class = "mb-4">11. 描述客觀事實，不做價值判斷。</p>
  <h3 class = "text-center border-top border-bottom ">關於答案</h3>
    <p> class = "mb-4">請將所有正確的答案以「、」分隔記入。且由於本站作答方式，建議將以下幾種答案也填入正解。</p>
      <ol>1. 常用之異體、俗體字。例：台灣、臺灣</ol>
      <ol>2. 非正式，但無須其他前後文輔助即足以正確辨識之名稱。例：臺灣積體電路製造、台灣積體電路製造、臺積電、台積電、TSMC</ol>
      <ol>3. 外語名詞、人名等之原文。例：賀錦麗、Kamala Devi Harris、Kamala Harris</ol>
    <p>系統會將第一個填入的作為依據顯示字數提示，建議將認知度最為廣的答案作為預設答案。</p>
  <h3 class = "text-center border-top border-bottom ">關於參考資料</h3>
    <p class = "mb-4">本站僅供娛樂用，考證時維基百科有雙語以上頁面足矣。若無維基百科頁面可供佐證，政府資訊或新聞、企業網站等法人頁面亦可。</p>
  <h6 class = "text-center border-top border-bottom ">給覺得很麻煩的你</h6>
    <p class = "mb-4">如果覺得限制太多，不知道自己的題目到底有沒有符合原則，就直接送出吧。所有題目我們都會審題、考證、修改，讓我們來幫你判斷！</p>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: "Principle"
})
</script>