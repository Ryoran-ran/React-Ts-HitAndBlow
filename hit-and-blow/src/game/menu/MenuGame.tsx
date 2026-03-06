import { useState } from 'react'
import {useLocation ,useNavigate } from 'react-router-dom'
import texts from '../../texts/ja.json'
import './menu.css'

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
        <h2 className="menu-title">ゲーム設定</h2>
        <p className="menu-subtitle">プレイ前にルールを設定できます。</p>

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
            onChange={(e) => setMaxDigits(Number(e.target.value))}
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
            onChange={(e) => setUseButton(Number(e.target.value))}
          />
        </div>

        {/* 重複あり */}
        <label className="menu-check" htmlFor="rule-duplication">
          <input
            id="rule-duplication"
            type="checkbox"
            checked={ruleDuplication}
            onChange={(e) => setRuleDuplication(e.target.checked)}
          />
          重複あり
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
          ゲーム開始
        </button>
      </section>
    </main>
  )
}
