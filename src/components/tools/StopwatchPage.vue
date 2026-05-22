<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">Stopwatch / Timer</h1>
    <div class="text-center display-4 mb-3">{{ formattedTime }}</div>
    <div class="d-flex justify-content-center mb-3">
      <button class="btn btn-success mx-1" @click="start" :disabled="running">Start</button>
      <button class="btn btn-danger mx-1" @click="stop" :disabled="!running">Stop</button>
      <button class="btn btn-secondary mx-1" @click="reset">Reset</button>
      <button class="btn btn-primary mx-1" @click="lap" :disabled="!running">Lap</button>
    </div>
    <ul class="list-group" v-if="laps.length">
      <li class="list-group-item" v-for="(lap, index) in laps" :key="index">
        Lap {{ laps.length - index }} – {{ lap }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "StopwatchPage",
  data() {
    return {
      elapsed: 0, // milliseconds
      intervalId: null,
      running: false,
      laps: []
    };
  },
  computed: {
    formattedTime() {
      const ms = this.elapsed % 1000;
      const totalSeconds = Math.floor(this.elapsed / 1000);
      const secs = totalSeconds % 60;
      const mins = Math.floor(totalSeconds / 60) % 60;
      const hrs = Math.floor(totalSeconds / 3600);
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms
        .toString()
        .padStart(3, "0")}`;
    }
  },
  methods: {
    start() {
      if (this.running) return;
      this.running = true;
      const startTime = Date.now() - this.elapsed;
      this.intervalId = setInterval(() => {
        this.elapsed = Date.now() - startTime;
      }, 10);
    },
    stop() {
      if (!this.running) return;
      this.running = false;
      clearInterval(this.intervalId);
      this.intervalId = null;
    },
    reset() {
      this.stop();
      this.elapsed = 0;
      this.laps = [];
    },
    lap() {
      this.laps.unshift(this.formattedTime);
    }
  },
  beforeDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
};
</script>

<style scoped>
/* No extra styles – rely on Bootstrap/Tailwind utilities */
</style>
