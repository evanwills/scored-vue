<script setup lang="ts">
import { ref, onMounted, onUpdated, reactive } from 'vue';

type singleScore = {
  id: number,
  score: number,
  bonus: number,
  total: number
}

const props = defineProps({
  allowBonus: Boolean,
  scoreList: Array
})

onMounted(() => {
  console.log('mounted')
  console.log('props.allowBonus:', props.allowBonus)
  console.log('props.scoreList:', props.scoreList)
});

onUpdated(() => {
  console.log('updated')
  console.log('props.allowBonus:', props.allowBonus)
  console.log('props.scoreList:', props.scoreList)
})

</script>


<template>
  <table>
    <thead>
      <tr>
        <th>Round</th>
        <th>Score</th>
        <th v-if="allowBonus">Bonus</th>
        <th>Cumulative</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="round in props.scoreList" :key="round.id">
        <th>{{(round.id + 1)}}</th>
        <td class="number">{{round.score}}</td>
        <td class="number" v-if="allowBonus">{{round.bonus}}</td>
        <td class="number">{{round.total}}</td>
      </tr>
    </tbody>
  </table>
</template>


<style scoped>
.number {
  text-align: right;;
}
table {
  border-spacing: 0;
  border-collapse: collapse;
}
td, th {
  border-left: 0.05rem solid #ccc;
  border-top: 0.05rem solid #ccc;
  padding: 0.3rem 0.5rem;
}
thead th {
  border-top: none;
  font-weight: normal;
}
th:first-child { border-left: none; text-align: center; }
</style>
