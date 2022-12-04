<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import ScoreList from './ScoreList.vue';

// import { singleScore } from '../vite-env.d';

let id = 0;
const emit = defineEmits(['added']);
const props = defineProps({
  playerName: String,
  playerId: Number,
  playerRank: { type: Number, coerce: ((input : string) : number => parseInt(input))},
  canAdd: Boolean,
  gameOver: Boolean,
  allowBonus: Boolean,
  detailed: Boolean
})

type singleScore = {
  id: number,
  score: number,
  bonus: number,
  total: number
}


// const state = reactive(_tmpScore)


const tmpScore = ref(0);
const tmpBonus = ref(0);
const scores : singleScore[] = []
let total : number = 0;
let lastScore : number = 0;
let currentRank : number = 0;
let leadClass : string = '';
let rank = '';
let doSave = ref(false);

/**
 * Update the rank text after component mounts or updates
 *
 * @param input
 */
function setRank(input : number) : string {
  if (input === 1) {
    return (props.gameOver === true)
      ? 'Winner'
      : 'Rank'
  } else {
    return '';
  }
}

/**
 * Set the latest bonus value
 *
 * @param e Event that triggered this callback
 */
function setTmpBonus (e : Event) : void {
  console.log('e:', e)

  if (props.allowBonus === false || props.gameOver === true) {
    // Bonuses are not allowed
    return;
  }

  if (typeof e.target !== 'undefined' && e.target !== null) {
    const input = e.target as HTMLInputElement;

    if (typeof input.value !== 'undefined') {
      tmpBonus.value = parseInt(input.value);;
    }
  }
  doSave.value = true;
}

/**
 * Set the players score for the current round.
 *
 * @param e Event that triggered this callback
 */
function setTmpScore (e : Event) : void {
  if (typeof e.target !== 'undefined' && e.target !== null) {
    const input = e.target as HTMLInputElement;

    if (typeof input.value !== 'undefined') {
      tmpScore.value = parseInt(input.value);
    }
  }
  doSave.value = true;
}

/**
 * Add current round's score to player
 *
 * @param score Score from current round for this player
 *
 * @returns
 */
function newScore (e : Event) : void {

  if (props.canAdd === false || props.gameOver === true) {
    // cannot add score for this user
    return;
  }

  lastScore = tmpScore.value + tmpBonus.value;
  console.log('lastScore:', lastScore)

  scores.push({
    id: id++,
    score: tmpScore.value,
    bonus: tmpBonus.value,
    total: 0
  });

  tmpScore.value = 0;
  tmpBonus.value = 0;

  total = 0;

  for (let a = 0; a < scores.length; a += 1) {
    console.log('scores[' + a + ']:', scores[a])
    total += scores[a].score + scores[a].bonus;
    scores[a].total = total;
  }

  emit('added', {total: total, id: props.playerId, round: scores.length});

  doSave.value = false;
}

onMounted(() => {
  console.log('props:', props)
  console.log('props.playerId:', props.playerId)
  if (typeof props.playerName === 'undefined' || props.playerName === null || props.playerName.trim() === '') {
    console.error('No player name defined')
  }
  if (typeof props.playerId === 'undefined' || props.playerId === null) {
    console.error('Player ID not defined')
  }

  if (typeof props.playerRank !== 'undefined') {
    currentRank = (props.playerRank * 1);

  }

  rank = setRank(currentRank);
  leadClass = rank.toLowerCase();
});

onUpdated(() => {
  if (typeof props.playerRank !== 'undefined') {
    currentRank = (props.playerRank * 1);
  }

  rank = setRank(currentRank);
  leadClass = rank.toLowerCase();
})

// defineExpose({total});
</script>

<template>
  <div class="player-wrap">
    <h3 :class="leadClass">{{ playerName }}: {{total}}</h3>
    <!-- <p v-if="(currentRank > 0)">
      <strong>{{rank}}: </strong> {{props.gameOver ? total : currentRank}}
    </p> -->
    <p v-if="props.canAdd">
      <label for="tmp-score">Latest score:</label>
      <input type="number" id="tmp-score" v-bind:value="tmpScore" @input="setTmpScore" />

      <label for="tmp-bonus" v-if="props.allowBonus">Bonus</label>
      <input type="number" id="tmp-bonus" v-bind:value="tmpBonus" @input="setTmpBonus" v-if="props.allowBonus" />

      <button @click="newScore" v-if="(doSave === true)">Save</button>
    </p>

    <ScoreList v-if="(scores.length > 0)" :score-list="scores" :key="id"></ScoreList>
  </div>
</template>

<style scoped>
h3 {
  text-align: center;
  margin: 0;
}
#tmp-score {
  display: inline-block;
  width: 3rem;
  padding: 0.2rem 0.5rem;
  margin: 0 0.3rem;
}
button {
  padding: 0.2rem 0.5rem;
}
.round-scores {
  text-align: left;
}
.single-score {
  display: inline-block;
  width: 4rem;
  text-align: right;
}
.player-wrap {
  text-align: left;
}
</style>
