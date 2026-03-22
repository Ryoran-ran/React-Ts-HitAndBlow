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
  difficultyPreset?: DifficultyPresetId
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

export type AchievementId =
  | 'first_clear'
  | 'clear_peach'
  | 'clear_green'
  | 'clear_blue'
  | 'clear_purple'
  | 'clear_limit_10'
  | 'clear_duplicate'
  | 'clear_non_number'
  | 'first_try'

export type AchievementDefinition = {
  id: AchievementId
  secret?: boolean
}

export type PlayResult = {
  cleared: boolean
  difficultyPreset: DifficultyPresetId
  answerCount: number
  answerLimit: number
  ruleDuplication: boolean
  buttonLabelMode: ButtonLabelMode
  guesses: string[]
}

export type StatisticsPresetId = Exclude<DifficultyPresetId, 'custom'>

export type StatisticsDetail = {
  plays: number
  clears: number
  fails: number
  bestClearTurns: number | null
}

export type StatisticsData = {
  totalPlays: number
  totalClears: number
  totalFails: number
  customPlays: number
  customClears: number
  customFails: number
  presets: Record<StatisticsPresetId, StatisticsDetail>
}
