import AppHeader from '../common/display/header'
import AppMenuGame from './MenuGame.tsx'

export default function AppMenu() {

  return (
    <main>
        {/* ヘッダー部 */}
        <AppHeader />

        {/* メニュー部 */}
        <AppMenuGame />
    </main>
  )
}