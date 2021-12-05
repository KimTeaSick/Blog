import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'
import './HighProfile.css'

export const HighProfile = () => (
	<>
		<Row>
			<Col span={8}></Col>
			<Col span={8}>
				<div className="profileImageWrapper">
					<img
						className="profileImage"
						src={require('assets/profileMain.png').default}
						alt="profileImage"
					/>
					<p>김요셉</p>
				</div>
			</Col>
			<Col span={8}></Col>
		</Row>
		<div className="LinkWrapper">
			<ul className="Linkli">
				<li>
					<Link to="/">MyProfile</Link>
				</li>
				<li>
					<Link to="/portfolio">Portfolio</Link>
				</li>
				<li>
					<Link to="/contact">Contact</Link>
				</li>
			</ul>
		</div>
		<div className="line" />
	</>
)

export default HighProfile
