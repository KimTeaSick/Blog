import { lazy } from 'react'
import { useRoutes } from 'react-router-dom'

const MyProfile = lazy(() => import('pages/MyProfile'))
const Portfolio = lazy(() => import('pages/Portfolio'))
const Contact = lazy(() => import('pages/Contact'))

const RouterConfig = () => {
	const routes = useRoutes([
		{ path: '/', element: <MyProfile /> },
		{ path: 'portfolio', element: <Portfolio /> },
		{ path: 'contact', element: <Contact /> }
	])
	return routes
}

export default RouterConfig
