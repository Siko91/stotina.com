<template>
  <div class="container-fluid py-3">
    <div class="row">
      <div class="col-md-6">
        <div class="d-flex">
          <pre class="line-numbers" v-html="lineNumbers" ref="linePre"></pre>
          <textarea
            class="form-control script-input flex-grow-1"
            v-model="htmlInput"
            @input="onHtmlUpdate"
            @scroll="syncScroll"
            spellcheck="false"
            wrap="off"
            ref="textarea"
          ></textarea>
        </div>
      </div>
      <div
        class="col-md-6"
        id="iframeContainer"
      >
        <iframe
          class="w-100 h-100 border"
          :srcdoc="htmlInput"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HtmlVisualizer",
  data() {
    return {
      htmlInput: `<div style="text-align:center;">\n  <h1>Hello, world!</h1>\n  <p>Have a great day!</p>\n</div>\n`,
    };
  },
  computed: {
    lineNumbers() {
      const lines = this.htmlInput.split("\n").length;
      let nums = "";
      for (let i = 1; i <= lines; i++) {
        nums += i + "\n";
      }
      return nums;
    },
  },
  methods: {
    onHtmlUpdate(event) {
      this.syncScroll(event);
    },
    syncScroll(event) {
      const el = event.target;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      this.savedScroll = ratio;

      this.applyScroll(this.$refs.linePre, ratio);
      if (this.$refs.textarea !== el)
        this.applyScroll(this.$refs.textarea, ratio);
    },
    applyScroll(elem, ratio) {
      const max = elem.scrollHeight - elem.clientHeight;
      if (max > 0) elem.scrollTop = ratio * max;
    },
  },
};
</script>

<style scoped>
.script-input {
  font-family: monospace;
  height: 70vh;
  resize: none;
  overflow: auto;
  font-size: 0.7rem;
}
.line-numbers {
  background: #f5f5f5;
  padding: 0.5rem;
  margin: 0;
  text-align: right;
  user-select: none;
  overflow: hidden;
  line-height: 1.5;
  color: #000000;
}
pre.line-numbers {
  width: 3rem;
  height: 70vh;
  font-size: 0.7rem;
}
#iframeContainer {
  height: 70vh;
}
iframe {
  height: 100% !important;
  width: 100% !important;
  background: #ffffff;
}
</style>
