import './Portfolio.css'

const Portfolio = () => (
	<div className="portfolioWrapper">
		<div className="metroketWrapper">
			<img
				className="metroketImg"
				src={require('assets/metroket.png').default}
				alt="metroket"
			/>
			<div className="content">
				<p className="name">Metroket</p>
				<p>
					지하철 중고거래 플랫폼 메트로켓입니다.
					<br />
					PM역활과 Front의 일부를 담당했습니다.
					<br />
					사용 언어 : JS CSS HTML PHP MYSQL
				</p>
			</div>
		</div>

		<div className="newrungopWrapper">
			<img
				className="newrungopImg"
				src={require('assets/newrungop.com.png').default}
				alt="newrungop"
			/>
			<div className="content">
				<p className="name">NewRunGop</p>
				<p>
					희귀동물 인터넷 구입 홈페이지 뉴련지오피.
					<br />
					메인페이지의 디자인, 프론트를 담당했습니다.
					<br />
					사용 언어 : JS CSS HTML
				</p>
			</div>
		</div>
	</div>
)

export default Portfolio
