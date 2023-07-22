<template>
  <div class="diffs-wrap code-diff">
    <div v-if="!diffHtml" class="no-changes-tip"><span>No changes found!</span></div>
    <div v-else v-html="diffHtml"/>
  </div>
</template>

<script setup>
import { computed }  from 'vue';
import * as Diff2Html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

const props = defineProps({
  diffContent: String,
});

const diffHtml = computed(() => {
  if (!props.diffContent) return '';

  return Diff2Html.html(props.diffContent, {
    drawFileList: false,
    matching: 'lines',
    diffStyle: 'char',
  });
});
</script>

<style scoped>
.diffs-wrap {
  position: relative;
  flex: 1;
  flex-grow: 1;
  padding: 16px;
  overflow: auto;
  background-color: white;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

html.dark .diffs-wrap {
  background-color: #002b36;
}

.no-changes-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  padding: 16px 0;
  font-size: 16px;
}
</style>
