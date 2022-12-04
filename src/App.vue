<script setup lang="ts">
import { ref, onMounted } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Game from './components/Game.vue'

let apID = 3;
let cpID = 0;

type _tmpPlayer = {
  id: number,
  name: string
}

type _gameType = {
  id: number,
  name: string,
  min: number|null,
  max: number|null,
  bonus: boolean,
  turns: boolean
}

/**
 * @var gameNames List of unique game names
 */
const gameNames : string[] = [];
/**
 * @var players List of player names
 */
const allPlayers = ref([
  { id: 0, name: 'Ada'},
  { id: 1, name: 'Evan'},
  { id: 2, name: 'Georgie'},
  { id: 3, name: 'Mallee'},
]);

const currentPlayers = ref([]);
const newPlayer = ref('');
const canStart = ref(0);
const gameType = ref(-1);

/**
 * @var current Data for the current game being played
 */
const started = ref(false);


const gameTypes : _gameType[] = [
  {
    id: 0,
    name: 'Gin rummy',
    min: undefined,
    max: undefined,
    bonus: true,
    turns: false
  },
  {
    id: 1,
    name: '500',
    min: -500,
    max: 500,
    bonus: false,
    turns: false
  }
]

let currentType : _gameType|null = null;

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
    <ul>
      <li v-for="_player in currentPlayers" :key="_player.id">{{_player.name}}</li>
      <li class="input-submit">
        <label for="new-player">Player:</label>
        <input type="text" id="new-player" list="player-list" :value="newPlayer" @input="updateTmpPlayer" />
        <datalist id="player-list">
          <option v-for="player_ in allPlayers" :value="player_.name" :key="player_.id"></option>
        </datalist>
        <button @click="addPlayer">+</button>
      </li>
    </ul>

    <p>
      <label for="game-name">Game:</label>
      <select id="game-name" :value="gameType" @change="setGameType">
        <option v-for="gType in gameTypes" :key="gType.id" :value="gType.id">{{gType.name}}</option>
      </select>
    </p>
    <button v-if="(canStart > 1 && currentType !== null)" @click="startGame">Start new game</button>
  </div>
  <div v-else="">
    <Game :player-names="currentPlayers" :name="currentType.name" :min="currentType.min" :max="currentType.max" :turns="currentType.turns" :allowBonus="currentType.bonus" />
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
</style>
