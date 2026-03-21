export type ButtonLabelMode = 'number' | 'kanji' | 'kanji_daiji' | 'heart' | 'roma'

export type DifficultyPresetId = 'custom' | 'easy' | 'normal' | 'hard' | 'expert'

export type DifficultyPreset = {
  id: DifficultyPresetId
  maxDigits: number
  useButton: number
  answerLimit: number
  ruleDuplication: boolean
}

export type PlaySettings = {
  maxDigits?: number
  useButton?: number
  ruleDuplication?: boolean
  buttonLabelMode?: ButtonLabelMode
  answerLimit?: number
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
