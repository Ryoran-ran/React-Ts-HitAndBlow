import type {
  DifficultyPresetId,
  PlayResult,
  StatisticsData,
  StatisticsDetail,
  StatisticsPresetId,
} from './type.ts'

const STORAGE_KEY = 'hitandblow_statistics'

function createStatisticsDetail(): StatisticsDetail {
  return {
    plays: 0,
    clears: 0,
    fails: 0,
    bestClearTurns: null,
  }
}

export function createInitialStatistics(): StatisticsData {
  return {
    totalPlays: 0,
    totalClears: 0,
    totalFails: 0,
    customPlays: 0,
    customClears: 0,
    customFails: 0,
    presets: {
      easy: createStatisticsDetail(),
      normal: createStatisticsDetail(),
      hard: createStatisticsDetail(),
      expert: createStatisticsDetail(),
    },
  }
}

export function loadStatistics(): StatisticsData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return createInitialStatistics()
  }

  return JSON.parse(raw) as StatisticsData
}

export function saveStatistics(statistics: StatisticsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statistics))
}

function updatePresetStatistics(
  statistics: StatisticsData,
  presetId: StatisticsPresetId,
  result: PlayResult
) {
  const preset = statistics.presets[presetId]
  preset.plays += 1

  if (result.cleared) {
    preset.clears += 1
    if (preset.bestClearTurns === null || result.answerCount < preset.bestClearTurns) {
      preset.bestClearTurns = result.answerCount
    }
    return
  }

  preset.fails += 1
}

export function recordStatistics(result: PlayResult): StatisticsData {
  const statistics = loadStatistics()

  statistics.totalPlays += 1
  if (result.cleared) {
    statistics.totalClears += 1
  } else {
    statistics.totalFails += 1
  }

  if (result.difficultyPreset === 'custom') {
    statistics.customPlays += 1
    if (result.cleared) {
      statistics.customClears += 1
    } else {
      statistics.customFails += 1
    }
  } else {
    updatePresetStatistics(statistics, result.difficultyPreset, result)
  }

  saveStatistics(statistics)
  return statistics
}

export function isPresetStatisticsId(
  presetId: DifficultyPresetId
): presetId is StatisticsPresetId {
  return presetId !== 'custom'
}
