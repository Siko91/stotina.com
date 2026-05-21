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
        <!-- Refresh button -->
        <div class="d-flex justify-content-end mb-3">
          <button class="btn btn-primary btn-sm" @click="refreshRates" title="Refresh rates">
            <i class="fas fa-sync"></i>
          </button>
        </div>
        <!-- Two-way amount inputs -->
        <div class="form-row mb-3">
          <div class="col">
            <label for="fromAmount">From Amount</label>
            <input
              type="number"
              step="any"
              min="0"
              v-model.number="fromAmount"
              @input="updateToAmount"
              id="fromAmount"
              class="form-control"
            />
          </div>
          <div class="col">
            <label for="from">From</label>
            <select v-model="from" id="from" class="form-control">
              <option v-for="code in sortedCodes" :key="code" :value="code">
                {{ code.toUpperCase() }} ({{ rates[code].name }})
              </option>
            </select>
          </div>
        </div>

        <div class="form-row mb-3">
          <div class="col">
            <label for="toAmount">To Amount</label>
            <input
              type="number"
              step="any"
              min="0"
              v-model.number="toAmount"
              @input="updateFromAmount"
              id="toAmount"
              class="form-control"
            />
          </div>
          <div class="col">
            <label for="to">To</label>
            <select v-model="to" id="to" class="form-control">
              <option v-for="code in sortedCodes" :key="code" :value="code">
                {{ code.toUpperCase() }} ({{ rates[code].name }})
              </option>
            </select>
          </div>
        </div>

        <!-- Refresh button was moved above -->
      </div>
    </div>
  </div>
</template>

<script>
import { getRates } from "../../services/coingecko";

export default {
  name: "Currency-Converter",
  data() {
    return {
      fromAmount: 1,
      toAmount: null,
      from: "eur",
      to: "usd",
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
        // Read URL query parameters to override defaults if present
        const query = this.$route && this.$route.query ? this.$route.query : {};
        if (query.from && this.rates[query.from]) this.from = query.from;
        if (query.to && this.rates[query.to]) this.to = query.to;
        if (query.amount && !isNaN(parseFloat(query.amount))) this.fromAmount = Number(query.amount);
        // After rates are loaded and values are set, calculate the initial conversion
        if (this.fromAmount != null) {
          this.updateToAmount();
        }
        // Sync URL to current state (in case defaults were used)
        this.updateUrl();
      } catch (e) {
        this.error = e.message || "Failed to load exchange rates.";
      } finally {
        this.loading = false;
      }
    },
    updateToAmount() {
      if (!this.rates) return;
      const src = this.rates[this.from];
      const tgt = this.rates[this.to];
      if (!src || !tgt) return;
      const result = this.fromAmount * (tgt.value / src.value);
      this.toAmount = Number(result.toFixed(tgt.type === "crypto" ? 6 : 2));
    },
    updateFromAmount() {
      if (!this.rates) return;
      const src = this.rates[this.from];
      const tgt = this.rates[this.to];
      if (!src || !tgt) return;
      const result = this.toAmount / (tgt.value / src.value);
      this.fromAmount = Number(result.toFixed(src.type === "crypto" ? 6 : 2));
    },
    refreshRates() {
      this.loadRates(true);
    },
    updateUrl() {
      if (!this.$router) return;
      const query = {
        from: this.from,
        to: this.to,
        amount: this.fromAmount
      };
      // Replace without adding a new history entry
      this.$router.replace({ query });
    }
  },
  computed: {
    sortedCodes() {
      if (!this.rates) return [];
      return Object.keys(this.rates).sort();
    },
  },
  watch: {
    from() {
      if (this.rates && this.fromAmount != null) {
        this.updateToAmount();
        this.updateUrl();
      }
    },
    to() {
      if (this.rates && this.fromAmount != null) {
        this.updateToAmount();
        this.updateUrl();
      }
    },
    fromAmount() {
      if (this.rates && this.fromAmount != null) {
        this.updateToAmount();
        this.updateUrl();
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* No additional styles needed – rely on Bootstrap classes */
</style>
