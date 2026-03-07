import { useState } from 'react'
import {useLocation ,useNavigate } from 'react-router-dom'
import texts from '../../texts/ja.json'
import './menu.css'
import * as MenuGame from './function/Menu'

type PlaySettings = {
  maxDigits?: number
  useButton?: number
  ruleDuplication?: boolean
}

export default function AppMenuGame() {
  const navigate = useNavigate()

  const location = useLocation()
  const settings = (location.state ?? {}) as PlaySettings

  const [ruleDuplication, setRuleDuplication] = useState(settings.ruleDuplication ?? false)
  const [maxDigits, setMaxDigits] = useState(settings.maxDigits ?? 4)
  const [useButton, setUseButton] = useState(settings.useButton ?? 10)

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
                  nextRuleDuplication
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
