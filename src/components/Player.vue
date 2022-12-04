<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import type { singleScore } from '../vite-env.d'
import ScoreList from './ScoreList.vue';

// import { singleScore } from '../vite-env.d';


let id = 0;
const emit = defineEmits(['added']);
const props = defineProps({
  playerName: { type: String, required: true },
  playerId: { type: Number, required: true },
  playerRank: { type: Number, coerce: ((input : string) : number => parseInt(input))},
  canAdd: Boolean,
  gameOver: Boolean,
  allowBonus: Boolean,
  detailed: Boolean,
  expanded: Boolean
})


// const state = reactive(_tmpScore)


const tmpScore = ref(0);
const tmpBonus = ref(0);
const isExpanded = ref(false);
const expandedClass = ref('score-list score-list--show');
const doSave = ref(false);
const gameOverClass = ref('player-wrap');
const scores : singleScore[] = []
let total : number = 0;
let lastScore : number = 0;
let currentRank : number = 0;
let leadClass : string = '';
let rank = '';


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
  isExpanded.value = props.expanded;
  expandedClass.value = (isExpanded.value)
    ? 'score-list score-list--show'
    : 'score-list score-list--hide'

  rank = setRank(currentRank);
  leadClass = rank.toLowerCase();
});

onUpdated(() => {
  if (typeof props.playerRank !== 'undefined') {
    currentRank = (props.playerRank * 1);
  }

  rank = setRank(currentRank);
  leadClass = rank.toLowerCase();
  console.log('props.gameOver:', props.gameOver);
  gameOverClass.value = (props.gameOver)
    ? 'player-wrap player-wrap--game-over'
    : 'player-wrap';
})

// defineExpose({total});
function showHide (e: Event) : void {
  isExpanded.value = !isExpanded.value;
  expandedClass.value = (isExpanded.value)
    ? 'score-list score-list--show'
    : 'score-list score-list--hide'
}
</script>

<template>
  <div :class="gameOverClass">
    <h3 :class="leadClass">{{ playerName }}: {{total}}</h3>
    <!-- <p v-if="(currentRank > 0)">
      <strong>{{rank}}: </strong> {{props.gameOver ? total : currentRank}}
    </p> -->
    <p v-if="(props.canAdd && !props.gameOver)">
      <label for="tmp-score">Latest score:</label>
      <input type="number" id="tmp-score" v-bind:value="tmpScore" @input="setTmpScore" />

      <label for="tmp-bonus" v-if="props.allowBonus">Bonus</label>
      <input type="number" id="tmp-bonus" v-bind:value="tmpBonus" @input="setTmpBonus" v-if="props.allowBonus" />

      <button @click="newScore" v-if="(doSave === true)">Add</button>
    </p>

    <!-- <div :class="expandedClass"> -->
      <!-- <button class="score-list-toggle" @click="showHide">{{props.expanded ? 'collapse' : 'expand'}}</button> -->
    <ScoreList :score-list="scores" :key="id" :allow-bonus="props.allowBonus" v-if="(scores.length > 0)"></ScoreList>
    <!-- </div> -->
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
  min-width: 14rem;
}
.score-list {
  position: relative;
  overflow: hidden;
  padding: 1rem;
  margin: -1rem;
}
.score-list-toggle {
  display: inline-block;
  height: 1rem;
  position: absolute;
  right: 0;
  text-indent: -1000rem;
  top: 0;
  width: 1rem;
}
.score-list-toggle::after {
  content: '\025B3';
  display: inline-block;
  height: 1rem;
  left: 0;
  line-height: 1rem;
  position: absolute;
  top: 0;
  text-indent: 0;
  transform-origin: 50% 50%;
  transition: transform ease-in-out 0.3s;
  width: 1rem;
}
.score-list--show .score-list-toggle::after {
  transform: rotate(180deg);
}
.score-list--hide .score-list-toggle::after {
  transform: rotate(0deg);
}
.score-list table {
  transition: height ease-in-out 0.3s;
  transform-origin: top center;
  display: block;
  width: 100%;
}
.score-list--hide table {
  height: 0;
}
.score-list--show table {
  height: auto;
}
h3.winner::after {
  content: ' (Winner!)';
}
</style>
