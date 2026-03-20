import { useState } from 'react'
import {useLocation ,useNavigate } from 'react-router-dom'
import texts from '../../texts/ja.json'
import './menu.css'
import * as MenuGame from './function/Menu'
import type {PlaySettings , ButtonLabelMode} from '../common/function/type.ts'

export default function AppMenuGame() {
  const navigate = useNavigate()

  const location = useLocation()
  const settings = (location.state ?? {}) as PlaySettings

  const [ruleDuplication, setRuleDuplication] = useState(settings.ruleDuplication ?? false)
  const [maxDigits, setMaxDigits] = useState(settings.maxDigits ?? 4)
  const [useButton, setUseButton] = useState(settings.useButton ?? 10)
  const [answerLimit, setAnswerLimit] = useState(settings.answerLimit ?? 0)
  const [buttonLabelMode, setButtonLabelMode] = useState<ButtonLabelMode>(
    settings.buttonLabelMode ?? 'number'
  )

  return (
    <main className="menu-layout">
      <section className="menu-card">
        <h2 className="menu-title">{texts.menu.menuTitle}</h2>
        <p className="menu-subtitle">{texts.menu.menuTitle}</p>

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
            onChange={(e) => setAnswerLimit(Number(e.target.value))}
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
              }
            }
          />
          {texts.menu.ruleDuplication}
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
              },
            })
          }
        >
          {texts.menu.gameStart}
        </button>
      </section>
    </main>
  )
}
