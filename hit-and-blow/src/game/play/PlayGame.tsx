import { useCallback, useEffect, useState } from 'react'
import { useLocation ,useNavigate } from 'react-router-dom'
import texts from '../../texts/ja.json'
import * as PlayGame from './function/Play'
import * as CommonFunction from '../common/function/common.ts'
import type {PlaySettings ,HitBlowResult, ButtonLabelMode } from '../common/function/type.ts'
import './play.css'

function AppPlayGame() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [answer, setAnswer] = useState('')
  const [hitBlowHistory, setHitBlowHistory] = useState<HitBlowResult[]>([])
  const [gameClear, setGameClear] = useState(false)
  const location = useLocation()
  const settings = (location.state ?? {}) as PlaySettings

  const maxDigits = settings.maxDigits ?? 4
  const useButton = settings.useButton ?? 10
  const ruleDuplication = settings.ruleDuplication ?? false
  const buttonLabelMode = (settings.buttonLabelMode ?? 'number') as ButtonLabelMode

  const numberButtons = texts.game.numberButtons[buttonLabelMode].slice(0, useButton)

  const buttonLabelMap = Object.fromEntries(
    numberButtons.map((btn) => [btn.value, btn.label])
  ) 

  const formatGuessLabel = (guess: string) => {
    return guess
      .split('')
      .map((digit) => buttonLabelMap[digit] ?? digit)
      .join('')
  }

  const onAnswer = useCallback(() => {
    if (gameClear || text.length < maxDigits) return

    const currentAnswer = answer === '' ? PlayGame.answerSet('' ,maxDigits ,useButton, ruleDuplication) : answer
    const result = PlayGame.checkHitAndBlow(currentAnswer, text)

    //回答作成(初回のみ)
    if (answer === '') {
      setAnswer(currentAnswer)
    }

    //Hit、Blowチェック
    setHitBlowHistory((prev) => [
      ...prev,
      {
        turn: prev.length + 1
        ,guess: text
        ,hit: result.hit
        ,blow: result.blow
      },
    ])

    //回答判定(Hit=桁数であればクリア)
    setGameClear(PlayGame.clearCheck(result.hit, maxDigits))

    //表示を初期化
    setText('')

    
  }, [answer, gameClear, maxDigits, text])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (gameClear) return

      if (event.key >= '0' && event.key <= '9') {
        setText((prev) => PlayGame.addDigit(prev, Number(event.key), maxDigits ,useButton))
        return
      }

      if (event.key === 'Backspace') {
        event.preventDefault()
        setText((prev) => PlayGame.removeLast(prev))
        return
      }

      if (event.key === 'Enter') {
        onAnswer()
        return
      }

      if (event.key === 'Escape') {
        setText('')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [gameClear, maxDigits, onAnswer])

  const onReset = () => {
    //表示を初期化
    setText('')

    //回答を初期化
    setGameClear(false)
    setAnswer('')

    //履歴を初期化
    setHitBlowHistory([])

  }
  // 画面表示
  return (
    <>
      <main className="play-layout">
        <section className="left-panel">
          {/* 数字タイトル */}
          <h2 className="panel-title">{texts.game.titleLeftPanel}</h2>

          {/* 数字入力部 */}
          <input
            type="text"
            value={formatGuessLabel(text)}
            readOnly
            className="guess-input"
          />

          {/* 数字ボタン */}
          <div className="number-grid">
            {numberButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() =>
                  setText((prev) =>
                    PlayGame.addDigit(prev, Number(btn.value), maxDigits, useButton)
                  )
                }
                disabled={gameClear}
              >
                {btn.label}
              </button>
            ))}
          </div>

          
          <div className="control-row">
            {/* クリア */}
            <button className="control-btn" onClick={() => setText('')} disabled={gameClear}>
              {texts.game.clear}
            </button>

            {/* １文字クリア */}
            <button  className="control-btn" onClick={() => setText((prev) => PlayGame.removeLast(prev))} disabled={gameClear}>
              {texts.game.delete}
            </button>
          </div>

          {/* 回答 */}
          <button onClick={onAnswer} disabled={gameClear || text.length < maxDigits} className="answer-btn">
            {texts.game.answer}
          </button>

          
          <div  className="control-row">
            {/* メニューに戻る */}
            <button className="control-btn reset-btn" 
              onClick={() =>
                navigate('/', {
                  state: {
                    maxDigits,
                    useButton,
                    ruleDuplication,
                    buttonLabelMode,
                  },
                })
              }
            >
              {texts.game.backMenu}
            </button>
            {/* リセット */}
            <button className="control-btn reset-btn" onClick={onReset}>{texts.game.gameReset}</button>
          </div>
        </section>

        {/* 履歴 */}
        <aside className="right-panel">
          <h2 className="panel-title">{texts.game.titleRightPanel}</h2>
          <div className="history-list">
            {hitBlowHistory
              .slice()
              .sort((a, b) => b.turn - a.turn)
              .map((item, index) => (
                <div key={item.turn} className="history-item">
                  {CommonFunction.format(
                    texts.game.historyMap,
                    item.turn,
                    formatGuessLabel(item.guess),
                    item.hit,
                    item.blow
                  )}
                  {gameClear && index === 0 ? texts.game.clearSentence : ''}
                </div>
              ))}
          </div>
        </aside>
      </main>
      
    </>
  )
}

export default AppPlayGame
