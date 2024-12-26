<template>
  <p>{{ displayedText }}</p>
</template>
  
<script lang="ts">
  import { defineComponent, ref, watch } from "vue";
  
  export default defineComponent({
    name: "TextDisplay",
    props: {
      fullText: {
        type: String,
        required: true,
      },
      normalSpeed: {
        type: Number,
        default: 120, // ms/chr
      },
      displaySpeed: {
        type: Number,
        default: 120, // ms/chr
      },
    },
    emits: ["countdown", "finish"],
    setup(props, { emit }) {
      const normalSpeed = props.normalSpeed;

      const displayedText = ref("");
      var isTextDisplaying = false;
      var textDisplayId = 0;
      var curText = "";
      var clearAll = false;

      const displayTextByCharacter = (speed: number) => {
        if (clearAll) {
          clearAll = false;
          curText = "";
          displayedText.value = curText;
        }

        isTextDisplaying = true;
        let char = curText.length; //character index
        const startTime = Date.now();
        let lastUpdateTime = startTime;
        const _updateText = () =>{
          if(!isTextDisplaying){// isTextDisplaying == false means text update has been canceled
            emit("countdown", curText.length);
            cancelAnimationFrame(textDisplayId);
            return;
          }

          if (char >= props.fullText.length) {
            if (speed === normalSpeed) { //nomal display ends
              emit("countdown", curText.length);
            } else { //fastforward display ends
              emit("finish");
              clearAll = true;
            }
            cancelAnimationFrame(textDisplayId);
            return;
          }
          const currentTime = Date.now();
          const passedTime = currentTime - lastUpdateTime;
          const charactersToShow = Math.floor(passedTime / speed); // 1 chr every [speed] milisecond pass
          if (charactersToShow > 0) {
            curText += props.fullText.slice(char, char + charactersToShow);
            char += charactersToShow;
            lastUpdateTime = currentTime;
            displayedText.value = curText;
          }
          textDisplayId = requestAnimationFrame(_updateText); //recursive call
        }
        textDisplayId = requestAnimationFrame(_updateText); // trigger
      };

      const textPlus = () => {
        let qt = props.fullText;
        let allLen = qt.length;
        let p = Math.max(Math.ceil(allLen / 10), 5); //magic numbers, determine by UX, no special meaning
        displayedText.value = qt.slice(0, Math.min(curText.length + p, allLen));
      };

      watch(() => props.displaySpeed, () => {
        let speed = props.displaySpeed;
        if(speed === 0){
          isTextDisplaying = false;
        }
        else if(speed === 1){
          textPlus();
        }
        else{
          displayTextByCharacter(speed);
        }
      });

    return {
      displayedText,
    };

    },
  });
</script>