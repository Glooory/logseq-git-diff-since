<template>
  <div class="diffs-panel">
    <div class="diffs-panel-content">
      <div class="toolbar">
        <span>What changed since </span>
        <el-select class="time-select" placeholder="Select" v-model="currTimeDuration" @change="onTimeDurationChange">
          <el-option v-for="item in timeConfigs[currTimeUnit].values" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select class="unit-select" placeholder="Select" v-model="currTimeUnit" @change="onTimeUnitChange">
          <el-option v-for="item in timeUnits" :key="item" :label="item" :value="item" />
        </el-select>
        ago
        <el-button class="close-btn" @click="onClosePanelBtnClick"><span class="close-btn-icon">X</span></el-button>
      </div>
      <Diffs :diffContent="diffHtml" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getGitDiffSince } from './utils/git.js';
import { timeUnits, timeConfigs } from './constants/time.js';
import Diffs from './components/Diffs.vue';

const currTimeDuration = ref(1);
const currTimeUnit = ref(timeUnits[0]);
const diffHtml = ref('');
const sinceParam = computed(() => `${currTimeDuration.value} ${currTimeUnit.value} ago`);

const handleGetDiffFailed = (err) => {
  logseq.App.showMsg(`Git whatchanged failed\n${err}`);
}

const queryGitDiffSince = () => {
  getGitDiffSince(sinceParam.value)
    .then(res => {
      if (res.exitCode === 0) {
        diffHtml.value = res.stdout;
      } else {
        handleGetDiffFailed();
      }
    })
    .catch(err => {
      handleGetDiffFailed(err);
    });
}

const onTimeDurationChange = () => {
  queryGitDiffSince();
}

const onTimeUnitChange = (e) => {
  currTimeDuration.value = timeConfigs[e].values[0];
  queryGitDiffSince();
}

const onClosePanelBtnClick = () => logseq.hideMainUI();

onMounted(() => {
  queryGitDiffSince();
});
</script>

<style scoped>
.diffs-panel {
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding: 48px;
  background: rgba(0, 0, 0, .2);
  box-sizing: border-box;
}

.diffs-panel-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-clip: border-box;
  box-shadow: 0 16px 48px 16px rgba(0, 0, 0, .08), 0 12px 32px rgba(0, 0, 0, .12), 0 8px 16px -8px rgba(0, 0, 0, .16);
}

.toolbar {
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);;
  background: #eeeeee;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  z-index: 2;
}

.time-select {
  width: 60px;
  margin: 0 8px;
}

.unit-select {
  width: 90px;
  margin-right: 8px;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  margin-left: auto;
}

.close-btn-icon {
  font-size: 16px;
  transform: scaleX(1.2);
}
</style>