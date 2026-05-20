<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">Currency Converter</h1>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="text-center my-3">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-md-8">
        <div class="form-group">
          <label for="amount">Amount</label>
          <input
            type="number"
            step="any"
            min="0"
            v-model.number="amount"
            id="amount"
            class="form-control"
          />
        </div>

        <div class="form-row">
          <div class="col">
            <label for="from">From</label>
            <select v-model="from" id="from" class="form-control">
              <option v-for="(info, code) in rates" :key="code" :value="code">
                {{ code.toUpperCase() }} ({{ info.name }})
              </option>
            </select>
          </div>
          <div class="col">
            <label for="to">To</label>
            <select v-model="to" id="to" class="form-control">
              <option v-for="(info, code) in rates" :key="code" :value="code">
                {{ code.toUpperCase() }} ({{ info.name }})
              </option>
            </select>
          </div>
        </div>

        <div class="mt-3 text-center">
          <button class="btn btn-primary mr-2" @click="refreshRates">Refresh rates</button>
        </div>

        <div class="mt-4 text-center" v-if="converted !== null">
          <h3>{{ amount }} {{ from.toUpperCase() }} = {{ converted }} {{ to.toUpperCase() }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRates, formatRate } from "../../services/coingecko";

export default {
  name: "Currency-Converter",
  data() {
    return {
      amount: 1,
      from: "usd",
      to: "eur",
      rates: null,
      loading: false,
      error: null,
    };
  },
  created() {
    this.loadRates();
  },
  methods: {
    async loadRates(force = false) {
      this.loading = true;
      this.error = null;
      try {
        this.rates = await getRates(force);
        // Ensure default selections exist in the fetched rates
        if (!this.rates[this.from]) this.from = Object.keys(this.rates)[0];
        if (!this.rates[this.to]) this.to = Object.keys(this.rates)[1] || this.from;
      } catch (e) {
        this.error = e.message || "Failed to load exchange rates.";
      } finally {
        this.loading = false;
      }
    },
    refreshRates() {
      this.loadRates(true);
    },
  },
  computed: {
    converted() {
      if (!this.rates) return null;
      const src = this.rates[this.from];
      const tgt = this.rates[this.to];
      if (!src || !tgt) return null;
      const result = this.amount * (tgt.value / src.value);
      return formatRate(result, tgt.type);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* No additional styles needed – rely on Bootstrap classes */
</style>
