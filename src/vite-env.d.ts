/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

export type basicPlayer = {
  id: number,
  name: string
}

export type simpleScoreData = {
  id: number,
  score: number,
  rank: number
}

export type keyedRank = {
  [index: number]: number
}

export type gamePlayerData = {
  id: number,
  name: string,
  score: number,
  rank: number,
  rankClass?: string,
  key?: number
}

export type scoreAddedData = {
  id: number,
  round: number
  total: number,
}

export type singleScore = {
  id: number,
  score: number,
  bonus: number,
  total: number
}

type player = {
  name: string,
  scores: singleScore[]
}

export type gameType = {
  id: number,
  name: string,
  min?: number,
  max?: number,
  bonus: boolean,
  turns: boolean
}

export type gameData = {
  type: string,
  players: player[],
  turn: number,
  round: number
}

export type gameProps = {
  playerNames: basicPlayer[],
  name: string,
  min: number,
  max: number,
  turns: boolean,
  gameOver: boolean,
  allowBonus: boolean
}
