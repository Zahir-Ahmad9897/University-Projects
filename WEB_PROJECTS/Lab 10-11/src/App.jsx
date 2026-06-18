import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import User from './component/User'
import Welcome from './component/Welcome'
import Props_render from './component/Props_render'
import ConditionalContent from './component/ConditionalContent'
// import FruitList from './component/FruitList'
import ArrowFunction from './component/ArrowFunction'

function App() {
  const [count, setCount] = useState(0)
  const fruits = ['Apple', 'Banana', 'Mango', 'Orange', 'Grapes']

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        
        <div className="main-header">
          <h1>React Lab 10</h1>
          <p className="subtitle">Mastering Components & Props</p>
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Interactive Count: {count}
        </button>     
         
        <div className="component-grid">
          {/* Task 1 & 2 */}
          {/* <Welcome /> */}
          
          {/* Task 4 */}
          {/* <User name="Zahir Ahmad" /> */}
          
          {/* Task 5 */}
          {/* <ConditionalContent isLoggedIn={count % 2 === 0} /> */}
          
          {/* Task 6 */}
          {/* <FruitList fruits={fruits} /> */}
          
          {/* Task 7 */}
          <ArrowFunction name="Zahir Ahmad" age={20} />
          
          {/* <Props_render /> */}
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

