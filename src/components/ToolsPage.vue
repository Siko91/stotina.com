<template>
  <div>
    <h1 class="text-center mb-4">Tools</h1>
    <div id="toolListArea">
      <ToolListElement category="regular"></ToolListElement>
    </div>
  </div>
</template>

<script>
import ToolListElement from "./elements/ToolListElement";

export default {
  name: "ToolsPage",
  data() {
    return {};
  },
  props: {},
  components: {
    ToolListElement
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
