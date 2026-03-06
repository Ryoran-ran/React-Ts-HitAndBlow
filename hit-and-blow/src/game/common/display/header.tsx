import './header.css'
import texts from '../../../texts/ja.json'

function AppHeader() {

  return (
    <header className="app-header">
      <h1 className="app-header__title">{texts.header.title}</h1>
      <p className="app-header__subtitle">{texts.header.subtitle}</p>
    </header>
  )
}

export default AppHeader
