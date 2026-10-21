<template>
  <div>
    <div class="appListBox row">
      <div v-for="game in games" v-bind:key="game.id" class="col-lg-4 col-md-6">
        <a
          class="gameListItem theme-br-mainFont"
          :class="game.path ? 'pointer animate' : 'empty'"
          v-on:click="$router.push(game.path)"
          v-bind:href="'/#' + game.path"
        >
          <div class="gameTitleArea">
            <div class="gameTitleIconBox">
              <img v-if="game.icon" v-bind:src="game.icon" :alt="game.name" />
            </div>
            <div class="gameTitle">{{ game.name }}</div>
          </div>
          <div class="gamePhoneBox">
            <div
              class="gamePhoneFrame theme-br-mainFont"
              :style="`background-image:url('${game.screenImage}')`"
            ></div>
          </div>
        </a>
      </div>
    </div>
    <div v-if="!games.length" class="text-center py-5">
      <p class="text-muted">No games yet. Check back soon!</p>
    </div>
  </div>
</template>

<script>
import games from "../../assets/games.json";

export default {
  name: "GameListElement",
  data() {
    return {
      games: games.map((el, id) => ({ ...el, id })),
    };
  },
  props: {},
  computed: {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.appListBox {
  width: 80%;
  margin: auto;
}
.gameListItem {
  display: block;
  color: inherit;
  text-decoration: inherit;

  margin-top: 20px;
  margin-bottom: 20px;
  border-width: 4px;
  border-style: solid;
  border-radius: 1rem;
}

.gameTitleArea {
  padding-top: 20px;
  text-align: center;
}
.gameTitleIconBox {
  display: inline-block;
  width: 90px;
  height: 80px;
  border-radius: 10px;
  background-color: var(--bg-color-mainFont) !important;
}
.gameTitleIconBox img {
  width: 90%;
  height: 90%;
  margin: 5% 5%;
}
.gameTitle {
  font-size: 1.7em;
  font-weight: bold;
}

.gamePhoneBox {
  margin-top: 10px;
  height: 270px;
  overflow: hidden;
}

.gamePhoneBox .gamePhoneFrame {
  width: 200px;
  height: 400px;
  background-size: 100% auto;
  background-repeat: no-repeat;
  border-width: 10px;
  border-top-width: 30px;
  border-style: solid;
  border-radius: 1em;
  margin: auto;
  margin-top: 20px;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.gameListItem.animate:hover .gamePhoneFrame {
  transform: rotate(5deg);
  transition: transform 0.3s ease-in-out;
}
.gameListItem.empty:hover .gamePhoneFrame {
  border: 10px solid #ffffff44 !important;
  border-top: 30px solid #ffffff44 !important;
  transition: 0.5s ease-in-out;
}

.gameListItem:hover .gameTitleArea {
  transition: color 0.5s;
  color: var(--font-footerLinks) !important;
  transform: scale(1.05);
}

.gameListItem:hover .gameTitleArea .gameTitleIconBox {
  transition: background-color 0.5s;
  background-color: var(--font-footerLinks) !important;
}
</style>
