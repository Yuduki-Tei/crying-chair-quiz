<template>
  <div class = "container justify-content-center">
    <div id="bit-grid" class = "d-block"></div>
  </div>
    <label for="bar">平均正解率 : {{ correctRating }} %</label>
    <CountdownBar id="bar" :barLength="correctRating" style="height: 8px; max-width: 240px" />
    <div
      class="d-flex align-items-center mt-3 mt-md-0"
      style="max-width: 300px; flex-shrink: 1;"
    >
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { fromBase64, sumBits } from "../composables";

export default defineComponent({
  name: "Test",
  setup() {

    const a = fromBase64("QAAAAAAAAABABAIAAAAACAAAAEAAAAAAEAAAAAAEAAgQEEAB+B8AAAADAUQAAAAAgP8BAAAAIAAAAAAAAAAAAAAAAAgA/A8=");
    const b = fromBase64("AAAAAAAAAABABAIAAAAACAAAAAAAAAAAEAAAAAAAAAgQAEABAAAAAAADAEAAAAAAgL4BAAAAAAAAAAAAAAAAAAAAAAgAfA8=");

    const correctRating = Math.floor((sumBits(b) / sumBits(a) || 0) * 10000) / 100;

    function visualizeBits(a: Uint8Array, b: Uint8Array) {
      const grid = document.getElementById('bit-grid');
      if (!grid) return; // Check if grid exists

      grid.innerHTML = ''; // Clear previous content

      const bitsPerRow = 10; // Number of bits per row
      let rowIndex = 0;
      let currentRow: HTMLElement | null = null; // Keep track of the current row

      for (let i = 0; i < a.length; i++) {
        const byteA = a[i];
        const byteB = b[i];

        for (let j = 0; j < 8; j++) {
          const bitA = (byteA >> j) & 1;
          const bitB = (byteB >> j) & 1;

          // Create a new row every 'bitsPerRow' bits
          if (rowIndex % bitsPerRow === 0) {
            // Create a new row container
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.alignItems = 'center';
            rowDiv.style.marginBottom = '4px';

            // Create a container for bits in this row
            const bitsContainer = document.createElement('div');
            bitsContainer.style.display = 'grid';
            bitsContainer.style.gridTemplateColumns = `repeat(${bitsPerRow}, 20px)`;
            bitsContainer.style.gap = '2px';

            rowDiv.appendChild(bitsContainer);
            grid.appendChild(rowDiv);

            // Update currentRow to the new bitsContainer
            currentRow = bitsContainer;
          }

          if (currentRow) {
            const bitCell = document.createElement('div');
            bitCell.style.width = '20px';
            bitCell.style.height = '20px';
            bitCell.style.border = '1px solid black';

            // Color logic: green if b is 1, red if a is 1 and b is 0
            if (bitB === 1) {
              bitCell.style.backgroundColor = 'green';
            } else if (bitA === 1 && bitB === 0) {
              bitCell.style.backgroundColor = 'red';
            }

            currentRow.appendChild(bitCell);
          }

          // Add line number to the end of the row
          if (rowIndex % bitsPerRow === bitsPerRow - 1 && currentRow?.parentNode) {
            const lineNumber = document.createElement('div');
            lineNumber.textContent = `${rowIndex + 1}`;
            lineNumber.style.marginLeft = '10px';
            currentRow.parentNode.appendChild(lineNumber);
          }

          rowIndex++;
        }
      }
    }

    onMounted(() => {
      visualizeBits(a, b); // Ensure it's called after DOM is rendered
    });

    return {
      correctRating,
    };
  },
});
</script>