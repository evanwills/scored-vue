/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


type singleScore = {
  id: number,
  score: number,
  bonus: number,
  total: number
}

type player = {
  name: string,
  scores: singleScore[]
}

type gameData = {
  type: string,
  players: player[],
  turn: number,
  round: number
}
