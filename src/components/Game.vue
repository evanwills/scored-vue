<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Player from './Player.vue'

type _tmpPlayer = {
  id: number,
  name: string
}

type _fullPlayer = {
  id: number,
  name: string,
  score: number,
  rank: number
}

const props = defineProps({
  playerNames: Array<_tmpPlayer>,
  name: String,
  min: Number,
  max: Number,
  turns: Boolean,
  gameOver: Boolean,
  allowBonus: Boolean
})

const players = ref([]);

/**
 * @var gameNames List of unique game names
 */
const gameNames : string[] = [];

function scoreUpdated (e: Event) : void {
  console.group('inside scoreUpdated()')
  console.log('e:', e)

  const tmp = [];
  players.value.forEach((player, i) => {
    console.log(player.name + ' (before):', player)

    if (player.id === e.id) {
      player.score = e.total;
      player.key += 1;
    }
    tmp.push({ 'id': player.id, score: player.score, rank: 0 });

    console.log(player.name + ' (after):', player)
  })

  tmp.sort((a, b) : number => {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    } else {
      return 0;
    }
  })

  const ranking = {};
  for (let a = 0; a < tmp.length; a += 1) {
    ranking[tmp[a].id] = (a + 1);
  }


  players.value.forEach((player, i) => {
    console.log(player.name + ' (before):', player)
    player.rank = ranking[player.id];
    player.rankClass = 'rank-' + player.rank;
    console.log(player.name + ' (after):', player)
  })

  console.groupEnd()
}

onMounted(() => {
  console.log('props.playerNames:', props.playerNames)
  // for (const player in props.playerNames) {
  //   console.log('player:', player)
  //   players.value.push({
  //     id: player.id,
  //     name: player.name,
  //     score: 0,
  //     rank: 0,
  //   })
  // }
  props.playerNames.forEach((player, i) => {
    players.value.push({
      id: player.id,
      name: player.name,
      score: 0,
      rank: 0,
      rankClass: '',
      key: 0
    })
  })
  console.log('players.value:', players.value);
});
</script>

<template>
  <h2>Playing: <span class="game-name">{{props.name}}</span></h2>
  <p>Hi this is a game</p>
  <ul class="player-list">
    <li v-for="player in players" :key="player.id" :class="player.rankClass">
      <Player :player-name="player.name" :player-id="player.id" :player-rank="player.rank" :can-add="(props.turns === false)" v-on:added="scoreUpdated"  />
    </li>
  </ul>
</template>

<style scoped>
h2 {
  font-weight: normal;
  font-size: 1.3rem;
  margin: 0.5rem 0 0;
}
.game-name {
  font-style: italic;
  font-weight: bold;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: 2rem;
}
.player-list {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.player-list li {
  margin: 0.5rem 0.5rem 2rem 0.5rem;
  padding: 1rem;
  border: 0.05rem solid #888;
  background-color: rgb(22, 22, 22);
}
</style>
