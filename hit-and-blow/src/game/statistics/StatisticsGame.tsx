import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import texts from '../../texts/ja.json'
import { calculateAverageTurns, loadStatistics } from '../common/function/statistics.ts'
import type { StatisticsPresetId } from '../common/function/type.ts'
import './statistics.css'

const presetOrder: StatisticsPresetId[] = ['easy', 'normal', 'hard', 'expert']

export default function AppStatisticsGame() {
  const navigate = useNavigate()
  const statistics = useMemo(() => loadStatistics(), [])

  return (
    <main className="statistics-layout">
      <section className="statistics-card">
        <h2 className="statistics-title">{texts.statisticsScreen.title}</h2>
        <p className="statistics-subtitle">{texts.statisticsScreen.subtitle}</p>

        <div className="statistics-results">
          <div className="statistics-grid">
            <article className="statistics-panel">
              <h3 className="statistics-panel-title">{texts.statisticsScreen.totalTitle}</h3>
              <div className="statistics-list">
                <p>{texts.statisticsScreen.totalPlays}: {statistics.totalPlays}</p>
                <p>{texts.statisticsScreen.totalClears}: {statistics.totalClears}</p>
                <p>{texts.statisticsScreen.totalFails}: {statistics.totalFails}</p>
              </div>
            </article>

            <article className="statistics-panel">
              <h3 className="statistics-panel-title">{texts.statisticsScreen.customTitle}</h3>
              <div className="statistics-list">
                <p>{texts.statisticsScreen.totalPlays}: {statistics.custom.plays}</p>
                <p>{texts.statisticsScreen.totalClears}: {statistics.custom.clears}</p>
                <p>{texts.statisticsScreen.totalFails}: {statistics.custom.fails}</p>
                <p>
                  {texts.statisticsScreen.bestClearTurns}: {statistics.custom.bestClearTurns ?? texts.statisticsScreen.none}
                </p>
                <p>
                  {texts.statisticsScreen.averageTurns}: {calculateAverageTurns(statistics.custom) ?? texts.statisticsScreen.none}
                </p>
              </div>
            </article>
          </div>

          <div className="statistics-preset-list">
            {presetOrder.map((presetId) => {
              const preset = statistics.presets[presetId]

              return (
                <article key={presetId} className="statistics-panel">
                  <h3 className="statistics-panel-title">
                    {texts.statisticsScreen.presetTitle} {texts.menu.difficultyOptions[presetId]}
                  </h3>
                  <div className="statistics-list">
                    <p>{texts.statisticsScreen.totalPlays}: {preset.plays}</p>
                    <p>{texts.statisticsScreen.totalClears}: {preset.clears}</p>
                    <p>{texts.statisticsScreen.totalFails}: {preset.fails}</p>
                    <p>
                      {texts.statisticsScreen.bestClearTurns}: {preset.bestClearTurns ?? texts.statisticsScreen.none}
                    </p>
                    <p>
                      {texts.statisticsScreen.averageTurns}: {calculateAverageTurns(preset) ?? texts.statisticsScreen.none}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <button
          className="statistics-back-btn"
          onClick={() => navigate('/')}
        >
          {texts.statisticsScreen.backMenu}
        </button>
      </section>
    </main>
  )
}
