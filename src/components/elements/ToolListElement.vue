<template>
  <div>
  <div class="toolListBox grid">
    <div v-for="tool in tools" v-bind:key="tool.id" class="toolCard">
        <a
          class="toolListItem"
          :class="tool.unfinished ? 'unfinished' : 'finished'"
          v-on:click="$router.push(tool.path)"
          v-bind:href="'/#' + tool.path"
        >
          <div
            class="toolTitleArea"
            v-bind:title="tool.unfinished ? 'Unfinished Tool' : tool.name"
          >
            <div class="toolTitleIconBox theme-bg-mainFont">
              <img v-if="tool.icon" v-bind:src="tool.icon" :alt="tool.name" />
            </div>
            <div class="toolTitle">{{ tool.name }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import tools from "../../assets/tools.json";

export default {
  name: "ToolListElement",
  data() {
    return {
      tools: tools.map((el, id) => ({ ...el, id })),
    };
  },
  props: {},
  computed: {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .toolListBox {
   width: 90%;
   margin: auto;
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
   gap: 1rem;
 }
 .toolListItem {
   display: block;
   color: inherit;
   text-decoration: inherit;

   margin: 0;
   padding: 0.5rem;

 }
 .toolTitleArea {
   padding: 0.5rem 0;
   text-align: center;
   transition: transform 0.3s ease;
 }
.toolTitleIconBox {
  display: inline-block;
  width: 120px;
  height: 120px;
  border-radius: 10px;
}
.toolTitleIconBox img {
  width: 90%;
  height: 90%;
  margin: 5% 5%;
}
.toolTitle {
  font-size: 1.2em;
  font-weight: bold;
}

 .toolListItem.finished:hover .toolTitleArea {
   color: var(--font-footerLinks) !important;
   transform: scale(1.05);
 }

 .toolListItem.finished:hover .toolTitleArea .toolTitleIconBox {
   background-color: var(--font-footerLinks) !important;
   transform: rotate(5deg);
 }

 .toolListItem.unfinished:hover {
   opacity: 0.3;
 }
</style>
