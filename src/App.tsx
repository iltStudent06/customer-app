import './App.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import AddPage from './pages/AddPage.tsx'
import EditPage from './pages/EditPage.tsx'
import ListPage from './pages/ListPage.tsx'

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ListPage />} />
            <Route path="/add" element={<AddPage />} />
            <Route path="/edit/:id" element={<EditPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </HashRouter>
  )
}

export default App
