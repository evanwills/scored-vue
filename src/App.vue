<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import type { basicPlayer, gameData, gameType } from './vite-env.d'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Game from './components/Game.vue'

let apID = 3;
let cpID = 0;


/**
 * @var players List of player names
 */
const allPlayers : Ref<basicPlayer[]> = ref([
  // { id: 0, name: 'Ada'},
  // { id: 1, name: 'Evan'},
  // { id: 2, name: 'Georgie'},
  // { id: 3, name: 'Mallee'},
]);

const currentPlayers : Ref<basicPlayer[]> = ref([]);
const newPlayer = ref('');
const canStart = ref(0);
const gameType = ref(-1);

/**
 * @var current Data for the current game being played
 */
const started = ref(false);


const gameTypes : gameType[] = [
  {
    id: 0,
    name: 'Any',
    min: undefined,
    max: undefined,
    bonus: false,
    turns: false
  },
  {
    id: 1,
    name: 'Gin rummy',
    min: undefined,
    max: undefined,
    bonus: true,
    turns: false
  },
  {
    id: 2,
    name: '500',
    min: -500,
    max: 500,
    bonus: false,
    turns: false
  }
]

let currentType : gameType|null = null;

/**
 * @var List of past game outcomes
 */
const games : gameData[] = [];

let rank = 1;

function addPlayer (e: Event) : void {
  const _tmp = newPlayer.value.trim()
  console.log('_tmp:', _tmp);
  console.log('allPlayers.value:', allPlayers.value);
  console.log('currentPlayers.value:', currentPlayers.value);

  if (_tmp === '') {
    return;
  }

  let found = allPlayers.value.filter(_player => _player.name === _tmp);
  console.log('found:', found)
  if (found.length === 0) {
    allPlayers.value.push({
      id: apID++,
      name: _tmp
    });
  }

  found = currentPlayers.value.filter(_player => _player.name === _tmp);
  console.log('found:', found)
  if (found.length === 0) {
    currentPlayers.value.push({
      id: cpID++,
      name: _tmp
    });

    canStart.value += 1;
  }

  newPlayer.value = '';
  // newPlayer.value.focus();

  console.log('newPlayer:', newPlayer)
  console.log('allPlayers:', allPlayers)
  console.log('currentPlayers:', currentPlayers)
}

function updateTmpPlayer (e: Event) : void {
  if (typeof e.target !== 'undefined' && e.target !== null) {
    const input = e.target as HTMLInputElement;
    console.log('input:', input)

    if (typeof input.value !== 'undefined') {
      console.log('input.value:', input.value)
      newPlayer.value = input.value
      console.log('newPlayer.value:', newPlayer.value)
    }
  }
}

function setGameType (e: Event) : void {
  if (typeof e.target !== 'undefined' && e.target !== null) {
    const input = e.target as HTMLInputElement;
    console.log('input:', input)

    if (typeof input.value !== 'undefined') {
      console.log('input.value:', input.value)
      gameType.value = parseInt(input.value)
      console.log('gameType.value:', gameType.value)

      for (let a = 0; a < gameTypes.length; a += 1) {
        if (gameType.value === gameTypes[a].id) {
          currentType = gameTypes[a];
          break;
        }
      }
    }
  }
}
function startGame (e: Event) : void {
  console.log('currentType:', currentType)
  console.log('canStart.value:', canStart.value)
  if (currentType !== null && canStart.value > 1) {
    console.log('starting')
    started.value = true;
  }
}
</script>

<template>
  <h1>Scored</h1>

  <div v-if="(started === false)">
    <h2>Players:</h2>
    <p v-if="(currentPlayers.length === 0)">
      Enter a players name in the "Player" box then click "+"
    </p>
    <ul class="player-list">
      <li v-for="_player in currentPlayers" :key="_player.id">{{_player.name}}</li>
      <li class="input-submit">
        <label for="new-player">Player:</label>
        <input type="text" id="new-player" list="player-list" :value="newPlayer" @input="updateTmpPlayer" placeholder="Alice" />
        <datalist id="player-list">
          <option v-for="player_ in allPlayers" :value="player_.name" :key="player_.id"></option>
        </datalist>
        <button @click="addPlayer">+</button>
      </li>
    </ul>

    <p class="game-name--wrap">
      <label for="game-name">Game:</label>
      <select id="game-name" :value="gameType" @change="setGameType" aria-describedby="game-name-desk">
        <option v-for="gType in gameTypes" :key="gType.id" :value="gType.id">{{gType.name}}</option>
      </select>
      <span v-if="(currentType === null)" id="game-name-desc">Choose type of game to play</span>
    </p>
    <button v-if="(canStart > 1 && currentType !== null)" @click="startGame">Start new game</button>
  </div>
  <div v-else="">
    <Game :player-names="currentPlayers" :name="(currentType as gameType).name" :min="(currentType as gameType).min" :max="(currentType as gameType).max" :turns="(currentType as gameType).turns" :allowBonus="(currentType as gameType).bonus" />
  </div>
</template>

<style scoped>
h1 {
  margin: 0;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.player-list {
  text-align: left;
  margin: 0;
  padding: 0;
}
.player-list li {
  margin-left: 1rem;
}
li.input-submit {
  list-style-type: none;
  margin: 1rem 0 0 0;
  padding: 0;
  text-align: left;
}
.input-submit * {
  display: inline-block;
  /* background-color: hotpink; */
}
.input-submit input {
  padding: 0.2rem 0.5rem;
  margin: 0 0 0 0.3rem;
}
.input-submit button {
  padding: 0.2rem 0.5rem;
  margin: 0 0 0 0.3rem;
  border: 0.05rem solid #fff;
}
#game-name {
  display: inline-block;
  margin-left: 0.3rem;
}
.game-name--wrap {
  text-align: left;
}
.game-name--wrap span {
  display: block;
  font-size: .875rem;
}
</style>
