<template>
    <Modal modalTitle = "投稿須知(ver. 2024/09/02)" confirmText = "我已閱讀並同意上述內容" :reject = true rejectText = "拒絕條款並返回主畫面">
    <p>在此由衷感謝您願意貢獻自己的腦力與時間，<router-link to="/" tag="a" target="_blank">這裡</router-link>有格式、標點等原則與標準供參。<br>
    本頁面僅提供單筆投稿功能，若您欲提供大量題目，請由問題回報表單留下您的聯絡方式，本站會盡速與您接洽。</p>

    <p class = "text-danger fs-4">投稿前請務必閱讀以下須知與聲明：</p>

    <li>1. 切勿提供任何可能侵害第三方權益之內容。</li>
    <li>2. 送出投稿時會同時紀錄您的使用者辨識碼(UID)。</li>
    <li>3. 一旦您按下送出按鈕後，等同於授權Crying Chair Project(以下稱本站)以無償、無記名方式利用您提供的內容。</li>
    <li>4. 承第三點，本站所謂利用包含但不限於：</li>
        <ol class = "mt-1 mb-0"> - 提供其他使用者閱覽、答題</ol>
        <ol class = "mb-1"> - 統計分析</ol>
    <li>5. 為維持文字風格統一與確保品質，本站有權以任何形式審查、修正、變更、或拒絕使用您提供的內容。</li>
    <li>6. 本站承諾不在本站以外之管道頒布、公開或以任何形式予以無關之第三人閱覽您提供的內容。</li>
    <li>7. 承第六點，本站無法保證本站其他使用者是否擅自將您的內容另做他用。</li>
    <li>8. 本站現階段並無營利，但無法保證未來不因為破產、貪財或任何其他原因突然開始刊載廣告、販售會員或以其他的方式營利。</li>

    <br><p>上述內容未提及之事項本站會盡最大努力，以社會一般道德標準與法律為原則判斷與處置，<br>
    惟可能因人力、技術不足而有所疏漏，望海涵。</p>
    <p class = "text-end text-mini">不要告我，拜託。</p>
    </Modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Modal from './Modal.vue';
export default defineComponent({
    name: "Agreement",
    components:{ Modal },
});
</script>

<style>
li, ol{
  list-style-type: none;
  font-size: small;
}
.text-mini{
    font-size: xx-small;
    color:rgb(70, 70, 70);
}
</style>