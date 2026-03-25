import './header.css'
import texts from '../../../texts/ja.json'
import type { DifficultyPresetId } from '../function/type.ts'

type HeaderItem = {
  label: string
  value: string
}

type AppHeaderProps = {
  settings?: HeaderItem[]
  difficultyPreset?: DifficultyPresetId
}

function AppHeader({ settings = [], difficultyPreset }: AppHeaderProps) {
  const difficultyClass =
    difficultyPreset && difficultyPreset !== 'custom'
      ? `app-header--difficulty-${difficultyPreset}`
      : ''

  return (
    <header className={`app-header ${difficultyClass}`.trim()}>
      <div className="app-header__main">
        <h1 className="app-header__title">{texts.header.title}</h1>
        <p className="app-header__subtitle">{texts.header.subtitle}</p>
      </div>
      {settings.length > 0 && (
        <dl className="app-header__settings" aria-label="現在の設定">
          {settings.map((item) => (
            <div key={item.label} className="app-header__setting-item">
              <dt className="app-header__setting-label">{item.label}</dt>
              <dd className="app-header__setting-value">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  )
}

export default AppHeader
