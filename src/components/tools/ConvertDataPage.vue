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
  "binary",
  "base3",
  "base4",
  "base5",
  "base6",
  "base8",
  "decimal",
  "hex",
  "hex-LE",
  "base32",
  "base58",
  "base64",
  "asm-script",
  "bitcoind-script",
];

const BASES = {
  binary: {
    alphabet: "01",
    chunkBytes: 1,
    bitsPerChar: 1,
    usePadding: false,
    caseSensitive: false,
  },
  base3: {
    alphabet: "012",
    chunkBytes: 3,
    bitsPerChar: null,
    usePadding: false,
    caseSensitive: false,
  },
  base4: {
    alphabet: "0123",
    chunkBytes: 2,
    bitsPerChar: 2,
    usePadding: false,
    caseSensitive: false,
  },
  base5: {
    alphabet: "01234",
    chunkBytes: 3,
    bitsPerChar: null,
    usePadding: false,
    caseSensitive: false,
  },
  base6: {
    alphabet: "012345",
    chunkBytes: 3,
    bitsPerChar: null,
    usePadding: false,
    caseSensitive: false,
  },
  base7: {
    alphabet: "0123456",
    chunkBytes: 3,
    bitsPerChar: null,
    usePadding: false,
    caseSensitive: false,
  },
  base8: {
    alphabet: "01234567",
    chunkBytes: 4,
    bitsPerChar: 3,
    usePadding: false,
    caseSensitive: false,
  },
  base9: {
    alphabet: "012345678",
    chunkBytes: 4,
    bitsPerChar: null,
    usePadding: false,
    caseSensitive: false,
  },
  decimal: {
    alphabet: "0123456789",
    chunkBytes: 4,
    bitsPerChar: null,
    usePadding: false,
    caseSensitive: false,
  },
  hex: {
    alphabet: "0123456789ABCDEF",
    chunkBytes: 4,
    bitsPerChar: 4,
    usePadding: false,
    caseSensitive: false,
  },
  base32: {
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", // RFC 4648
    chunkBytes: 5,
    bitsPerChar: 5,
    usePadding: true,
    caseSensitive: false,
  },
};

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
        if (this.selectedTypeFrom === "base58") {
          inputBuf = bsvjs.Base58.decode(this.inputValue);
        } else if (this.selectedTypeFrom === "asm-script") {
          inputBuf = bsvjs.Script.fromAsmString(this.inputValue).toBuffer();
        } else if (this.selectedTypeFrom === "bitcoind-script") {
          inputBuf = bsvjs.Script.fromBitcoindString(
            this.inputValue,
          ).toBuffer();
        } else if (this.selectedTypeFrom === "hex-LE") {
          inputBuf = Buffer.from(this.inputValue, "hex").reverse();
        } else if (BASES[this.selectedTypeFrom]) {
          inputBuf = this.baseAnyDecode(
            this.inputValue,
            BASES[this.selectedTypeFrom],
          );
        } else {
          inputBuf = Buffer.from(this.inputValue, this.selectedTypeFrom);
        }

        if (this.selectedTypeTo === "base58") {
          this.outputValue = bsvjs.Base58.encode(inputBuf);
        } else if (this.selectedTypeTo === "asm-script") {
          this.outputValue = bsvjs.Script.fromBuffer(inputBuf).toAsmString();
        } else if (this.selectedTypeTo === "bitcoind-script") {
          this.outputValue = bsvjs.Script.fromBuffer(
            inputBuf,
          ).toBitcoindString();
        } else if (this.selectedTypeTo === "hex-LE") {
          this.outputValue = inputBuf.reverse().toString("hex");
        } else if (BASES[this.selectedTypeTo]) {
          this.outputValue = this.baseAnyEncode(
            inputBuf,
            BASES[this.selectedTypeTo],
          );
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
    // Generic base encoder
    baseAnyEncode(buffer, { alphabet, ...props }) {
      if (!buffer || buffer.length === 0) return "";

      const base = alphabet.length;
      let result = "";

      for (let i = 0; i < buffer.length; i += props.chunkBytes) {
        let chunkValue = 0;
        let actualBytes = 0;

        // 1. Pack buffer bytes into a single chunk integer
        for (let j = 0; j < props.chunkBytes && i + j < buffer.length; j++) {
          chunkValue = chunkValue * 256 + buffer[i + j];
          actualBytes++;
        }

        let chunkResult = "";

        if (props.bitsPerChar) {
          // --- Power-of-2 Bases ---
          const totalBits = actualBytes * 8;
          const targetChars = Math.ceil(totalBits / props.bitsPerChar);
          const fullChars = Math.ceil(
            (props.chunkBytes * 8) / props.bitsPerChar,
          );

          // Left-shift partial trailing chunks to align bits to the left
          const paddingBits = targetChars * props.bitsPerChar - totalBits;
          chunkValue = chunkValue * Math.pow(2, paddingBits);

          let tempValue = chunkValue;
          for (let k = 0; k < targetChars; k++) {
            let remainder = tempValue % base;
            chunkResult = alphabet[remainder] + chunkResult;
            tempValue = Math.floor(tempValue / base);
          }

          // Append standard '=' padding if enabled
          if (props.usePadding) {
            while (chunkResult.length < fullChars) {
              chunkResult += "=";
            }
          }
        } else {
          // --- Non-Power-of-2 Bases ---
          const chunkCharLength = Math.ceil(
            (actualBytes * 8) / (Math.log(base) / Math.LN2),
          );
          let tempValue = chunkValue;
          for (let k = 0; k < chunkCharLength; k++) {
            let remainder = tempValue % base;
            chunkResult = alphabet[remainder] + chunkResult;
            tempValue = Math.floor(tempValue / base);
          }
        }

        result += chunkResult;
      }

      return result;
    },
    // Generic base decoder
    baseAnyDecode(encodedStr, { alphabet, caseSensitive, ...props }) {
      if (!encodedStr) return Buffer.alloc(0);

      const base = alphabet.length;
      let lookupAlphabet = caseSensitive ? alphabet : alphabet.toLowerCase();

      // Remove trailing padding characters before processing
      let cleanStr = encodedStr.replace(/=+$/, "");
      let targetStr = caseSensitive ? cleanStr : cleanStr.toLowerCase();

      let resultBytes = [];

      if (props.bitsPerChar) {
        // --- Power-of-2 Bases ---
        const fullChars = Math.ceil((props.chunkBytes * 8) / props.bitsPerChar);

        for (let i = 0; i < targetStr.length; i += fullChars) {
          let chunkStr = targetStr.substring(i, i + fullChars);
          let chunkValue = 0;

          for (let j = 0; j < chunkStr.length; j++) {
            let index = lookupAlphabet.indexOf(chunkStr[j]);
            if (index === -1)
              throw new Error(`Invalid character: "${chunkStr[j]}"`);
            chunkValue = chunkValue * base + index;
          }

          const totalBits = chunkStr.length * props.bitsPerChar;
          const actualBytes = Math.floor(totalBits / 8);

          // Shift back right to strip out trailing padding bits
          const paddingBits = totalBits - actualBytes * 8;
          chunkValue = Math.floor(chunkValue / Math.pow(2, paddingBits));

          let tempValue = chunkValue;
          let chunkBytes = [];
          for (let k = 0; k < actualBytes; k++) {
            chunkBytes.unshift(tempValue % 256);
            tempValue = Math.floor(tempValue / 256);
          }
          resultBytes.push.apply(resultBytes, chunkBytes);
        }
      } else {
        // --- Non-Power-of-2 Bases ---
        const fullChars = Math.ceil(
          (props.chunkBytes * 8) / (Math.log(base) / Math.LN2),
        );

        for (let i = 0; i < targetStr.length; i += fullChars) {
          let chunkStr = targetStr.substring(i, i + fullChars);
          let chunkValue = 0;

          for (let j = 0; j < chunkStr.length; j++) {
            let index = lookupAlphabet.indexOf(chunkStr[j]);
            if (index === -1)
              throw new Error(`Invalid character: "${chunkStr[j]}"`);
            chunkValue = chunkValue * base + index;
          }

          const actualBytes = Math.floor(
            (chunkStr.length * (Math.log(base) / Math.LN2)) / 8,
          );
          let tempValue = chunkValue;
          let chunkBytes = [];
          for (let k = 0; k < actualBytes; k++) {
            chunkBytes.unshift(tempValue % 256);
            tempValue = Math.floor(tempValue / 256);
          }
          resultBytes.push.apply(resultBytes, chunkBytes);
        }
      }

      return Buffer.from(resultBytes);
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
