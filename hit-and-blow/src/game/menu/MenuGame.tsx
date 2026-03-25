import { useState } from 'react'
import {useLocation ,useNavigate } from 'react-router-dom'
import texts from '../../texts/ja.json'
import './menu.css'
import * as MenuGame from './function/Menu'
import type {
  ButtonLabelMode,
  DifficultyPreset,
  DifficultyPresetId,
  PlaySettings,
} from '../common/function/type.ts'

const difficultyPresets: DifficultyPreset[] = [
  { id: 'easy', maxDigits: 3, useButton: 6, answerLimit: 0, ruleDuplication: false },
  { id: 'normal', maxDigits: 4, useButton: 8, answerLimit: 0, ruleDuplication: false },
  { id: 'hard', maxDigits: 4, useButton: 10, answerLimit: 10, ruleDuplication: false },
  { id: 'expert', maxDigits: 5, useButton: 10, answerLimit: 12, ruleDuplication: true },
]

function findPresetId(settings: {
  maxDigits: number
  useButton: number
  answerLimit: number
  ruleDuplication: boolean
}): DifficultyPresetId {
  const matchedPreset = difficultyPresets.find(
    (preset) =>
      preset.maxDigits === settings.maxDigits &&
      preset.useButton === settings.useButton &&
      preset.answerLimit === settings.answerLimit &&
      preset.ruleDuplication === settings.ruleDuplication
  )

  return matchedPreset?.id ?? 'custom'
}

export default function AppMenuGame() {
  const navigate = useNavigate()

  const location = useLocation()
  const settings = (location.state ?? {}) as PlaySettings

  const [ruleDuplication, setRuleDuplication] = useState(settings.ruleDuplication ?? false)
  const [maxDigits, setMaxDigits] = useState(settings.maxDigits ?? 4)
  const [useButton, setUseButton] = useState(settings.useButton ?? 10)
  const [answerLimit, setAnswerLimit] = useState(settings.answerLimit ?? 0)
  const [showCurrentStats, setShowCurrentStats] = useState(settings.showCurrentStats ?? true)
  const [buttonLabelMode, setButtonLabelMode] = useState<ButtonLabelMode>(
    settings.buttonLabelMode ?? 'number'
  )
  const [difficultyPreset, setDifficultyPreset] = useState<DifficultyPresetId>(
    settings.difficultyPreset ??
      findPresetId({
        maxDigits: settings.maxDigits ?? 4,
        useButton: settings.useButton ?? 10,
        answerLimit: settings.answerLimit ?? 0,
        ruleDuplication: settings.ruleDuplication ?? false,
      })
  )

  const syncPreset = (
    nextSettings: {
      maxDigits: number
      useButton: number
      answerLimit: number
      ruleDuplication: boolean
    }
  ) => {
    setDifficultyPreset(findPresetId(nextSettings))
  }

  const applyPreset = (presetId: DifficultyPresetId) => {
    setDifficultyPreset(presetId)

    if (presetId === 'custom') {
      return
    }

    const preset = difficultyPresets.find((item) => item.id === presetId)
    if (!preset) {
      return
    }

    setMaxDigits(preset.maxDigits)
    setUseButton(preset.useButton)
    setAnswerLimit(preset.answerLimit)
    setRuleDuplication(preset.ruleDuplication)
  }

  return (
    <main className="menu-layout">
      <section className="menu-card">
        <h2 className="menu-title">{texts.menu.menuTitle}</h2>
        <p className="menu-subtitle">{texts.menu.menuExplain}</p>

        <div className="menu-field">
          <label className="menu-label" htmlFor="difficulty-preset">
            {texts.menu.difficulty}
          </label>
          <select
            id="difficulty-preset"
            className="menu-input"
            value={difficultyPreset}
            onChange={(e) => applyPreset(e.target.value as DifficultyPresetId)}
          >
            <option value="easy">{texts.menu.difficultyOptions.easy}</option>
            <option value="normal">{texts.menu.difficultyOptions.normal}</option>
            <option value="hard">{texts.menu.difficultyOptions.hard}</option>
            <option value="expert">{texts.menu.difficultyOptions.expert}</option>
            <option value="custom">{texts.menu.difficultyOptions.custom}</option>
          </select>
          <p className="menu-subtitle">
            {texts.menu.difficultyDescriptions[difficultyPreset]}
          </p>
        </div>

        {/* 桁数 */}
        <div className="menu-field">
          <label className="menu-label" htmlFor="max-digits">
            {texts.menu.digits}
          </label>
          <input
            id="max-digits"
            className="menu-input"
            type="number"
            value={maxDigits}
            max={10}
            min={1}
            onChange={(e) => 
              {
                const nextMaxDigit = Number(e.target.value)
                setMaxDigits(nextMaxDigit)

                const fixedMaxDigits = MenuGame.fixButtonToDigit(
                  nextMaxDigit,
                  useButton,
                  ruleDuplication
                )
                setMaxDigits(fixedMaxDigits)
                syncPreset({
                  maxDigits: fixedMaxDigits,
                  useButton,
                  answerLimit,
                  ruleDuplication,
                })
              }
            }
          />
        </div>

        {/* ボタン数 */}
        <div className="menu-field">
          <label className="menu-label" htmlFor="use-button">
            {texts.menu.useButton}
          </label>
          <input
            id="use-button"
            className="menu-input"
            type="number"
            value={useButton}
            max={10}
            min={3}
            onChange={(e) => 
                {
                  const nextUseButton = Number(e.target.value)
                  setUseButton(nextUseButton)

                  const fixedMaxDigits = MenuGame.fixButtonToDigit(
                    maxDigits,
                    nextUseButton,
                    ruleDuplication
                  )
                  setMaxDigits(fixedMaxDigits)
                  syncPreset({
                    maxDigits: fixedMaxDigits,
                    useButton: nextUseButton,
                    answerLimit,
                    ruleDuplication,
                  })
              }
            }
          />
        </div>

        {/* 回答制限 */}
        <div className="menu-field">
          <label className="menu-label" htmlFor="answer-limit">
            {texts.menu.answerLimit}
          </label>
          <input
            id="answer-limit"
            className="menu-input"
            type="number"
            value={answerLimit}
            min={0}
            onChange={(e) => {
              const nextAnswerLimit = Number(e.target.value)
              setAnswerLimit(nextAnswerLimit)
              syncPreset({
                maxDigits,
                useButton,
                answerLimit: nextAnswerLimit,
                ruleDuplication,
              })
            }}
          />
        </div>


        {/* ボタンラベル */}
        <div className="menu-field">
          <label className="menu-label" htmlFor="button-label-mode">
            {texts.menu.buttonLabelMode}
          </label>
          <select
            id="button-label-mode"
            className="menu-input"
            value={buttonLabelMode}
            onChange={(e) => setButtonLabelMode(e.target.value as ButtonLabelMode)}
          >
            <option value="number">{texts.menu.buttonLabelModeOptions.number}</option>
            <option value="kanji">{texts.menu.buttonLabelModeOptions.kanji}</option>
            <option value="kanji_daiji">{texts.menu.buttonLabelModeOptions.kanji_daiji}</option>
            <option value="heart">{texts.menu.buttonLabelModeOptions.heart}</option>
            <option value="roma">{texts.menu.buttonLabelModeOptions.roma}</option>
          </select>
        </div>

        {/* 重複あり */}
        <label className="menu-check" htmlFor="rule-duplication">
          <input
            id="rule-duplication"
            type="checkbox"
            checked={ruleDuplication}
            onChange={(e) => 
              {
                const nextRuleDuplication = e.target.checked
                setRuleDuplication(nextRuleDuplication)

                const fixedMaxDigits = MenuGame.fixButtonToDigit(
                  maxDigits,
                  useButton,
                  nextRuleDuplication,
                )
                setMaxDigits(fixedMaxDigits)
                syncPreset({
                  maxDigits: fixedMaxDigits,
                  useButton,
                  answerLimit,
                  ruleDuplication: nextRuleDuplication,
                })
              }
            }
          />
          {texts.menu.ruleDuplication}
        </label>

        <label className="menu-check" htmlFor="show-current-stats">
          <input
            id="show-current-stats"
            type="checkbox"
            checked={showCurrentStats}
            onChange={(e) => setShowCurrentStats(e.target.checked)}
          />
          {texts.menu.showCurrentStats}
        </label>

        {/* ゲームスタート */}
        <button
          className="menu-start-btn"
          onClick={() =>
            navigate('/play', {
              state: {
                maxDigits,
                useButton,
                ruleDuplication,
                buttonLabelMode,
                answerLimit,
                difficultyPreset,
                showCurrentStats,
              },
            })
          }
        >
          {texts.menu.gameStart}
        </button>
        <button
          className="menu-sub-btn"
          onClick={() => navigate('/achievements')}
        >
          {texts.menu.showAchievements}
        </button>
        <button
          className="menu-sub-btn"
          onClick={() => navigate('/statistics')}
        >
          {texts.menu.showStatistics}
        </button>
      </section>
    </main>
  )
}
