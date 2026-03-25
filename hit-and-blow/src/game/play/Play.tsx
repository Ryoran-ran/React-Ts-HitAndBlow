import AppHeader from '../common/display/header'
import AppPlayGame from './PlayGame'
import { useLocation } from 'react-router-dom'
import texts from '../../texts/ja.json'
import type {
  ButtonLabelMode,
  DifficultyPresetId,
  PlaySettings,
} from '../common/function/type.ts'
import './play.css'

function AppPlay() {
  const location = useLocation()
  const settings = (location.state ?? {}) as PlaySettings

  const maxDigits = settings.maxDigits ?? 4
  const useButton = settings.useButton ?? 10
  const ruleDuplication = settings.ruleDuplication ?? false
  const buttonLabelMode = (settings.buttonLabelMode ?? 'number') as ButtonLabelMode
  const answerLimit = settings.answerLimit ?? 0
  const difficultyPreset = (settings.difficultyPreset ?? 'custom') as DifficultyPresetId

  const headerSettings = [
    { label: texts.menu.difficulty, value: texts.menu.difficultyOptions[difficultyPreset] },
    { label: texts.menu.digits, value: `${maxDigits}` },
    { label: texts.menu.useButton, value: `${useButton}` },
    {
      label: texts.menu.ruleDuplication,
      value: ruleDuplication ? texts.menu.booleanOptions.true : texts.menu.booleanOptions.false,
    },
    { label: texts.menu.answerLimit, value: answerLimit > 0 ? `${answerLimit}` : texts.menu.none },
    { label: texts.menu.buttonLabelMode, value: texts.menu.buttonLabelModeOptions[buttonLabelMode] },
  ]

  return (
    <main className="play-screen">
        {/* ヘッダー部 */}
        <AppHeader settings={headerSettings} />

        {/* ゲーム部 */}
        <AppPlayGame />
    </main>
  )
}

export default AppPlay
