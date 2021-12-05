import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import HighProfile from 'components/HighProfile'
import LoadingSpinner from 'components/LoadingSpinner'
import RouterConfig from 'router'

const App = () => (
	<>
		<BrowserRouter>
			<HighProfile />
			<Suspense fallback={<LoadingSpinner />}>
				<RouterConfig />
			</Suspense>
		</BrowserRouter>
	</>
)

export default App
