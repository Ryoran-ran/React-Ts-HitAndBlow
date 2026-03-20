export type ButtonLabelMode = 'number' | 'kanji' | 'kanji_daiji' | 'heart' | 'roma'

export type PlaySettings = {
  maxDigits?: number
  useButton?: number
  ruleDuplication?: boolean
  buttonLabelMode?: ButtonLabelMode
}

export type JudgeResult = {
  hit: number
  blow: number
}

export type HitBlowResult = {
    turn: number
    guess: string
    hit: number
    blow: number
}