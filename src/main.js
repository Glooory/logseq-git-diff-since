import '@logseq/libs'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const operations = () => {
  return {
    showDiffsPanel() {
      logseq.showMainUI();
    }
  }
}

function main() {
  logseq.App.registerUIItem('toolbar', {
    key: 'open-diffs-panel', template: `
      <a class="button" id="open-diffs-panel-button" data-on-click="showDiffsPanel" data-rect>
       <i class="ti ti-file-diff"></i> 
      </a>
    `,
  })

  createApp(App).mount('#app');
}

// bootstrap
logseq.provideModel(operations());
logseq.ready(main).catch(console.error);
