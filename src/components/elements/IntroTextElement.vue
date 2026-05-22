<template>
  <div class="introWrapper text-center">
    <div class="intro">
      <div class="title">Hello, World!</div>
      <div class="description">
        <div>
          I'm Aleks - a backend engineer, tool builder
          <br />
          and (ocasionally) consultant.
        </div>
      </div>
      <button class="call-to-action" v-on:click="onLetsTalkClick()">
        Let's Talk!
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "IntroTextElement",
  data() {
    return {};
  },
  props: {},
  components: {},
  methods: {
    onLetsTalkClick() {
      this.$router.push("/about");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.introWrapper {
  padding-top: 20px;
}
.intro {
  padding: 2rem;
  margin: auto;
  width: 80%;
}
.title {
  font-size: 2rem;
  margin: 1rem 0;
}
.description {
  font-size: 1.1rem;
}

.call-to-action {
  display: inline-block;
  margin: auto;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  background: #2a9fd6;
  border: 4px solid transparent;
  border-radius: 25px;
  color: black;
  margin: 30px 0;
}

.call-to-action:hover {
  border: 4px ridge #0e3649;
  text-decoration: underline;
}
</style>
