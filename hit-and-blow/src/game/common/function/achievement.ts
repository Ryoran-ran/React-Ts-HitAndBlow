import type {
  AchievementDefinition,
  AchievementId,
  PlayResult,
} from './type.ts'

const STORAGE_KEY = 'hitandblow_achievements'

export const achievements: AchievementDefinition[] = [
  { id: 'first_clear' },
  { id: 'clear_limit_10' },
  { id: 'clear_peach' },
  { id: 'clear_green' },
  { id: 'clear_blue' },
  { id: 'clear_purple' },
  { id: 'first_try' },
  { id: 'clear_duplicate' },
  { id: 'clear_non_number' },
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
