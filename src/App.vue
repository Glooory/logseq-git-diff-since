<template>
  <div v-if="ready" class="diffs-panel">
    <div class="diffs-panel-content">
      <div class="toolbar">
        <el-button class="refresh-btn" @click="onRefreshBtnClick">
          <img class="refresh-icon" :src="refreshIcon" alt="refresh-icon" />
        </el-button>
        <span>What changed since </span>
        <el-select class="time-select" placeholder="Select" v-model="currTimeDuration" @change="onTimeDurationChange">
          <el-option v-for="item in timeConfigs[currTimeUnit].values" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select class="unit-select" placeholder="Select" v-model="currTimeUnit" @change="onTimeUnitChange">
          <el-option v-for="item in timeUnits" :key="item" :label="item" :value="item" />
        </el-select>
        <span v-if="currTimeUnit !== 'commit'">ago</span>
        <el-button class="close-btn" @click="onClosePanelBtnClick"><span class="close-btn-icon">X</span></el-button>
      </div>
      <Diffs :diffContent="diffHtml" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getGitDiffSince } from './utils/git.js';
import { timeUnits, defaultTimeUnit, timeConfigs } from './constants/time.js';
import Diffs from './components/Diffs.vue';
import refreshIcon from './assets/ic_refresh.svg';

const ready = ref(false);
const currTimeDuration = ref(1);
const currTimeUnit = ref(defaultTimeUnit);
const diffHtml = ref('');
const gitCommandParams = computed(() => {
  if (currTimeUnit.value === 'commit') {
    return ['diff'];
  }
  return ['log', `--since="${currTimeDuration.value} ${currTimeUnit.value} ago"`, '-p'];
});

const handleGetDiffFailed = (err) => {
  logseq.App.showMsg(`Git whatchanged failed\n${err}`);
}

const queryGitDiffSince = () => {
  getGitDiffSince(gitCommandParams.value)
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

const resetAndQuery = () => {
  currTimeDuration.value = 1;
  currTimeUnit.value = defaultTimeUnit;
  queryGitDiffSince();
}

const onRefreshBtnClick = () => {
  queryGitDiffSince();
}

const onTimeDurationChange = () => {
  queryGitDiffSince();
}

const onTimeUnitChange = (e) => {
  currTimeDuration.value = timeConfigs[e].values[0];
  queryGitDiffSince();
}

const onClosePanelBtnClick = () => logseq.hideMainUI();

const onThemeChange = (theme) => {
  if (theme === 'dark') {
    document.querySelector('html').classList.add('dark');
  } else {
    document.querySelector('html').classList.remove('dark');
  }
}

onMounted(() => {
  const theme = parent.document.querySelector('html').getAttribute('data-theme');
  onThemeChange(theme);
  logseq.App.onThemeModeChanged(e => onThemeChange(e.mode));
  setTimeout(() => {
    ready.value = true;
    queryGitDiffSince();
  }, 0);
  logseq.App.onCurrentGraphChanged(resetAndQuery);
});
</script>

<style scoped>
.diffs-panel {
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding: 48px;
  background-color: rgba(0, 0, 0, .2);
  box-sizing: border-box;
}

.diffs-panel-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
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
  background-color: #eeeeee;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  z-index: 2;
}

html.dark .toolbar {
  background-color: #023643;
}

.refresh-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin-right: 16px;
}

.refresh-icon {
  width: 20px;
  height: 20px;
}

.time-select {
  width: 70px;
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
