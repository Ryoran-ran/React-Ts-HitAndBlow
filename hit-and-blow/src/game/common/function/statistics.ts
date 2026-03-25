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
    totalClearTurns: 0,
  }
}

export function createInitialStatistics(): StatisticsData {
  return {
    totalPlays: 0,
    totalClears: 0,
    totalFails: 0,
    custom: createStatisticsDetail(),
    presets: {
      easy: createStatisticsDetail(),
      normal: createStatisticsDetail(),
      hard: createStatisticsDetail(),
      expert: createStatisticsDetail(),
    },
  }
}

function normalizeStatisticsDetail(detail: Partial<StatisticsDetail> | undefined): StatisticsDetail {
  return {
    plays: detail?.plays ?? 0,
    clears: detail?.clears ?? 0,
    fails: detail?.fails ?? 0,
    bestClearTurns: detail?.bestClearTurns ?? null,
    totalClearTurns: detail?.totalClearTurns ?? 0,
  }
}

export function loadStatistics(): StatisticsData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return createInitialStatistics()
  }

  const parsed = JSON.parse(raw) as Partial<StatisticsData> & {
    customPlays?: number
    customClears?: number
    customFails?: number
  }

  return {
    totalPlays: parsed.totalPlays ?? 0,
    totalClears: parsed.totalClears ?? 0,
    totalFails: parsed.totalFails ?? 0,
    custom: parsed.custom
      ? normalizeStatisticsDetail(parsed.custom)
      : {
          plays: parsed.customPlays ?? 0,
          clears: parsed.customClears ?? 0,
          fails: parsed.customFails ?? 0,
          bestClearTurns: null,
          totalClearTurns: 0,
        },
    presets: {
      easy: normalizeStatisticsDetail(parsed.presets?.easy),
      normal: normalizeStatisticsDetail(parsed.presets?.normal),
      hard: normalizeStatisticsDetail(parsed.presets?.hard),
      expert: normalizeStatisticsDetail(parsed.presets?.expert),
    },
  }
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
    preset.totalClearTurns += result.answerCount
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
    statistics.custom.plays += 1
    if (result.cleared) {
      statistics.custom.clears += 1
      statistics.custom.totalClearTurns += result.answerCount
      if (
        statistics.custom.bestClearTurns === null ||
        result.answerCount < statistics.custom.bestClearTurns
      ) {
        statistics.custom.bestClearTurns = result.answerCount
      }
    } else {
      statistics.custom.fails += 1
    }
  } else {
    updatePresetStatistics(statistics, result.difficultyPreset, result)
  }

  saveStatistics(statistics)
  return statistics
}

export function getStatisticsDetail(
  statistics: StatisticsData,
  presetId: DifficultyPresetId
): StatisticsDetail {
  return presetId === 'custom' ? statistics.custom : statistics.presets[presetId]
}

export function calculateAverageTurns(detail: StatisticsDetail): number | null {
  if (detail.clears === 0) {
    return null
  }

  return Math.round((detail.totalClearTurns / detail.clears) * 10) / 10
}
