<template>
  <div>
    <h1 class="text-center mb-4">Games</h1>
    <div id="gameListArea">
      <GameListElement></GameListElement>
    </div>
  </div>
</template>

<script>
import GameListElement from "./elements/GameListElement";

export default {
  name: "GamesPage",
  data() {
    return {};
  },
  props: {},
  components: {
    GameListElement
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
