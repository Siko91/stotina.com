<template>
  <div>
    <h1 class="text-center">Data Converter</h1>
    <!-- // TODO: Implement this tool -->

    <div class="mainContainer px-5">
      <div class="input-group row mx-auto">
        <select
          class="form-select col-sm-6 col-md-2"
          id="selectFrom"
          v-model="selectedTypeFrom"
          v-on:change="onUpdate()"
        >
          <option
            v-for="option in dataTypes"
            v-bind:key="option"
            :value="option"
            >{{ option }}</option
          >
        </select>
        <label class="input-group-text col-sm-2 col-md-1" for="selectFrom"
          >FROM</label
        >

        <label class="input-group-text col-sm-4 col-md-2" for="selectFrom">
        </label>

        <div
          type="button"
          v-on:click="swap()"
          class="btn btn-secondary col-sm-12 col-md-2"
        >
          ⇔
        </div>

        <label class="input-group-text col-sm-4 col-md-2" for="selectTo">
        </label>

        <label
          class="input-group-text text-end col-sm-2 col-md-1"
          for="selectTo"
          >INTO</label
        >
        <select
          class="form-select col-sm-6 col-md-2"
          id="selectTo"
          v-model="selectedTypeTo"
          v-on:change="onUpdate()"
        >
          <option
            v-for="option in dataTypes"
            v-bind:key="option"
            :value="option"
            >{{ option }}</option
          >
        </select>
      </div>
    </div>
    <div class="my-2"></div>
    <div class="row">
      <div class="form-floating col-sm-12 col-md-6">
        <div class="m-5">
          <textarea
            class="form-control"
            v-model="inputValue"
            v-on:change="onUpdate()"
            v-on:keyup="onUpdate()"
            id="inputArea"
            placeholder="Awaiting Input..."
            rows="15"
          ></textarea>
          <div>{{ inputValue.length }} characters</div>
        </div>
      </div>
      <div class="form-floating col-sm-12 col-md-6">
        <div class="m-5">
          <textarea
            class="form-control"
            v-model="outputValue"
            disabled
            id="inputArea"
            rows="15"
          ></textarea>
          <div>{{ outputValue.length }} characters</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Buffer } from "../../assets/js/buffer";
import bsvjs from "../../assets/js/bsv.2.0.10/bsv.bundle";

window.Buffer = Buffer;

const dataTypes = [
  "ascii",
  "utf8",
  "utf16le",
  "latin1",
  "ucs2",
  "base64",
  "hex",
  "hex-LE",
  "binary",
  "decimal",
  "asm-script",
  "bitcoind-script",
  "base-58",
];

export default {
  name: "Convert-Data",
  data() {
    return {
      dataTypes,
      selectedTypeFrom: this.$route.query.from || "utf8",
      selectedTypeTo: this.$route.query.to || "hex",
      inputValue: this.$route.query.value || "",
      outputValue: "",
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.onUpdate();
    });
  },
  methods: {
    swap() {
      const tempFrom = this.selectedTypeFrom;
      this.selectedTypeFrom = this.selectedTypeTo;
      this.selectedTypeTo = tempFrom;
      this.inputValue = this.outputValue;
      this.onUpdate();
    },
    onUpdate() {
      let inputBuf;
      try {
        if (this.selectedTypeFrom === "decimal") {
          inputBuf = new bsvjs.Bn(this.inputValue).toBuffer();
        } else if (this.selectedTypeFrom === "base-58") {
          inputBuf = bsvjs.Base58.decode(this.inputValue);
        } else if (this.selectedTypeFrom === "asm-script") {
          inputBuf = bsvjs.Script.fromAsmString(this.inputValue).toBuffer();
        } else if (this.selectedTypeFrom === "bitcoind-script") {
          inputBuf = bsvjs.Script.fromBitcoindString(
            this.inputValue
          ).toBuffer();
        } else if (this.selectedTypeFrom === "hex-LE") {
          inputBuf = Buffer.from(this.inputValue, "hex").reverse();
        } else if (this.selectedTypeFrom === "binary") {
          inputBuf = this.binary2Buf(this.inputValue);
        } else {
          inputBuf = Buffer.from(this.inputValue, this.selectedTypeFrom);
        }

        if (this.selectedTypeTo === "decimal") {
          this.outputValue = bsvjs.Bn.fromBuffer(inputBuf).toString();
        } else if (this.selectedTypeTo === "base-58") {
          this.outputValue = bsvjs.Base58.encode(inputBuf);
        } else if (this.selectedTypeTo === "asm-script") {
          this.outputValue = bsvjs.Script.fromBuffer(inputBuf).toAsmString();
        } else if (this.selectedTypeTo === "bitcoind-script") {
          this.outputValue = bsvjs.Script.fromBuffer(
            inputBuf
          ).toBitcoindString();
        } else if (this.selectedTypeTo === "hex-LE") {
          this.outputValue = inputBuf.reverse().toString("hex");
        } else if (this.selectedTypeTo === "binary") {
          this.outputValue = this.buf2Binary(inputBuf);
        } else {
          this.outputValue = inputBuf.toString(this.selectedTypeTo);
        }
        this.saveState();
      } catch (error) {
        console.debug(inputBuf);
        this.outputValue = error.stack;
      }
    },
    saveState() {
      const query = {
        from: this.selectedTypeFrom,
        to: this.selectedTypeTo,
        value: this.inputValue,
      };

      if (
        this.$route.query.from !== query.from ||
        this.$route.query.to !== query.to ||
        this.$route.query.value !== query.value
      ) {
        this.$router.push({ path: "/tools/convertdata", query });
      }
    },
    buf2Binary(buf) {
      const parts = [];
      for (let i = 0; i < buf.length; i++) {
        parts.push(this.dec2Bin(buf[i]));
      }
      return parts.join("");
    },
    dec2Bin(d) {
      var b = "";
      for (var i = 0; i < 8; i++) {
        b = (d % 2) + b;
        d = Math.floor(d / 2);
      }
      return b;
    },
    binary2Buf(binStr) {
      const chunks = [];
      for (let i = 0; i < binStr.length; i += 8) {
        const chunk = binStr.substr(i, 8).padEnd(8, "0");
        chunks.push(parseInt(chunk, 2));
      }
      return Buffer.from(chunks);
    },
  },
  props: {},
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text-end {
  text-align: end !important;
}
.swapBtn {
  border-radius: 100px;
  border: none;
}
</style>
