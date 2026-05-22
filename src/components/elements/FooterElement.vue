<template>
  <div class="container-fluid">
    <div class="footer theme-bg-nav row">
      <div class="footer-group col-md-5 col-lg-1" style="text-align:center;">
        <div>
          <img src="/images/logo.png" alt />
        </div>
        <div>Copyright © 2026 Stotina</div>
      </div>

      <div class="footer-group col-md-7 col-lg-2">
        <div class="row footer-group-title">Stotina</div>
        <div class="row">
          <a
            class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
            v-on:click="navigate('/about')"
            href="/#/about"
          >
            About Us
          </a>
          <a
            class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
            v-on:click="navigate('/blog')"
            href="/#/blog"
          >
            News Blog
          </a>
          <a
            class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
            v-on:click="navigate('/faq')"
            href="/#/faq"
          >
            FAQ
          </a>
          <a
            class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
            v-on:click="navigate('/terms')"
            href="/#/terms"
          >
            Terms
          </a>
          <a
            class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12"
            v-on:click="navigate('/privacy')"
            href="/#/privacy"
          >
            Privacy
          </a>
        </div>
      </div>

      <div class="footer-group col-md-12 col-lg-4">
        <div class="row footer-group-title">Tools</div>
        <div class="row">
          <a
            v-for="tool in this.tools"
            :key="tool.id"
            class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12 col-md-4 col-lg-6"
            v-on:click="navigate(tool.path)"
            v-bind:href="'/#' + tool.path"
          >
            {{ tool.name }}
          </a>
        </div>
      </div>

      <div class="footer-group col-md-12 col-lg-4">
        <div class="row footer-group-title">Apps</div>
        <div class="row">
          <a
            v-for="app in this.apps"
            :key="app.id"
            class="footer-link theme-c-footerLinks theme-c-hover pointer col-sm-12 col-md-4 col-lg-6"
            v-on:click="navigate(app.path)"
            v-bind:href="'/#' + app.path"
          >
            {{ app.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apps from "../../assets/apps.json";
import tools from "../../assets/tools.json";

export default {
  name: "FooterElement",
  data() {
    return {
      apps: apps.map((el, id) => ({ ...el, id })),
      tools: tools.map((el, id) => ({ ...el, id })),
    };
  },
  props: {},
  computed: {
    currentPage() {
      return this.$router.currentRoute.path;
    },
  },
  methods: {
    navigate(path) {
      this.$router.push(path);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  padding-top: 1rem;
  position: relative;
  z-index: 2;
}

.footer img {
  width: 100px;
}

.footer-group {
  min-width: 10rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.footer-group-title {
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid white;
  margin-bottom: 0.2rem;
  margin-left: 0.5rem;
}

.footer-link {
  padding: 0;
  border: 1px solid transparent;
}

.footer-link:hover {
  border: 1px solid var(--hover-font-important) !important;
}
</style>
