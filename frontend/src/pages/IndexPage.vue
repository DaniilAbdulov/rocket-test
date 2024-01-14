<template>
  <q-page class="row items-center justify-evenly"> <LeadsTable /> </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LeadsTable from '../components/LeadsTable.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    LeadsTable,
  },
  setup() {
    return {};
  },
});
</script>
