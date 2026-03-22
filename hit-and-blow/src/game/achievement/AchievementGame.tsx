import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import texts from '../../texts/ja.json'
import { achievements, loadUnlockedAchievements } from '../common/function/achievement.ts'
import './achievement.css'

export default function AppAchievementGame() {
  const navigate = useNavigate()

  const unlockedIds = useMemo(() => loadUnlockedAchievements(), [])
  const unlockedSet = new Set(unlockedIds)

  return (
    <main className="achievement-layout">
      <section className="achievement-card">
        <h2 className="achievement-title">{texts.achievementScreen.title}</h2>
        <p className="achievement-subtitle">{texts.achievementScreen.subtitle}</p>

        <div className="achievement-list">
          {achievements.map((achievement) => {
            const unlocked = unlockedSet.has(achievement.id)
            const achievementText = texts.achievements[achievement.id]

            return (
              <article
                key={achievement.id}
                className={`achievement-item ${unlocked ? 'is-unlocked' : 'is-locked'}`}
              >
                <div className="achievement-item-header">
                  <h3 className="achievement-item-title">{achievementText.name}</h3>
                  <span className="achievement-badge">
                    {unlocked
                      ? texts.achievementScreen.unlocked
                      : texts.achievementScreen.locked}
                  </span>
                </div>
                <p className="achievement-item-description">
                  {achievementText.description}
                </p>
              </article>
            )
          })}

          {unlockedIds.length === 0 && (
            <p className="achievement-empty">{texts.achievementScreen.empty}</p>
          )}
        </div>

        <button
          className="achievement-back-btn"
          onClick={() => navigate('/')}
        >
          {texts.achievementScreen.backMenu}
        </button>
      </section>
    </main>
  )
}
