import AppHeader from '../common/display/header'
import AppPlayGame from './PlayGame'
import './play.css'

function AppPlay() {

  return (
    <main className="play-screen">
        {/* ヘッダー部 */}
        <AppHeader />

        {/* ゲーム部 */}
        <AppPlayGame />
    </main>
  )
}

export default AppPlay
