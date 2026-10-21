<template>
  <div>
    <h1 class="text-center mb-4">Blockchain Tools</h1>
    <div id="toolListArea">
      <ToolListElement category="blockchain"></ToolListElement>
    </div>
  </div>
</template>

<script>
import ToolListElement from "./elements/ToolListElement";

export default {
  name: "BlockchainToolsPage",
  components: {
    ToolListElement,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>