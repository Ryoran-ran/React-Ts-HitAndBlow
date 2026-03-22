import type {
  AchievementDefinition,
  AchievementId,
  PlayResult,
} from './type.ts'

const STORAGE_KEY = 'hitandblow_achievements'

export const achievements: AchievementDefinition[] = [
  { id: 'first_clear', name: 'はじめの一歩', description: '初めてクリア' },
  { id: 'clear_limit_10',
    name: '痛みこそ強くなる',
    description: '回答回数制限10回以下でクリア',
  },
  { id: 'clear_peach', name: '桃クリア', description: '難易度: 桃でクリア' },
  { id: 'clear_green', name: '緑クリア', description: '難易度: 緑でクリア' },
  { id: 'clear_blue', name: '蒼クリア', description: '難易度: 蒼でクリア' },
  { id: 'clear_purple', name: '茈クリア', description: '難易度: 茈でクリア' },
  { id: 'first_try', name: '運が良い', description: '1回目の回答で正解' },
  { id: 'clear_duplicate', name: '見破る力', description: '重複ありでクリア' },
  {
    id: 'clear_non_number',
    name: '数字以外でも大丈夫',
    description: '数字以外のボタン表示でクリア',
  },
]

export function judgeAchievements(result: PlayResult): AchievementId[] {
  const unlocked: AchievementId[] = []

  if (!result.cleared) {
    return unlocked
  }

  unlocked.push('first_clear')

  if (result.difficultyPreset === 'easy') unlocked.push('clear_peach')
  if (result.difficultyPreset === 'normal') unlocked.push('clear_green')
  if (result.difficultyPreset === 'hard') unlocked.push('clear_blue')
  if (result.difficultyPreset === 'expert') unlocked.push('clear_purple')

  if (result.answerLimit > 0 && result.answerLimit <= 10) {
    unlocked.push('clear_limit_10')
  }

  if (result.ruleDuplication) {
    unlocked.push('clear_duplicate')
  }

  if (result.buttonLabelMode !== 'number') {
    unlocked.push('clear_non_number')
  }

  if (result.answerCount === 1) {
    unlocked.push('first_try')
  }

  return unlocked
}

export function loadUnlockedAchievements(): AchievementId[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as AchievementId[]) : []
}

export function saveUnlockedAchievements(ids: AchievementId[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function unlockAchievements(result: PlayResult): AchievementId[] {
  const current = loadUnlockedAchievements()
  const judged = judgeAchievements(result)
  const newUnlocked = judged.filter((id) => !current.includes(id))

  if (newUnlocked.length === 0) {
    return []
  }

  saveUnlockedAchievements([...new Set([...current, ...newUnlocked])])
  return newUnlocked
}
