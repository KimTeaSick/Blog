import './MyProfile.css'

const MyProfile = () => (
	<div className="profileWrapper">
		<p className="name">김요셉 (Josef)</p>
		<div className="content">
			<p>notseph8556@gmail.com</p>
			<p>010 9109 4860</p>
			<p>
				Github |{' '}
				<a href="https://github.com/KimTeaSick">
					https://github.com/KimTeaSick
				</a>
			</p>
		</div>
		<p className="name">자격증</p>
		<div className="content">
			<p>16 | GTQ 포토샵 1급</p>
			<p>18 | 자동차 운전면허 1종</p>
			<p>21 | 정보처리 산업기사</p>
		</div>
		<p className="name">참여내역</p>
		<div className="content">
			<p>메트로켓 | 교내 프로젝트 메트로켓 PM</p>
			<p>뉴런GOP | 인터넷 쇼핑몰 NewRunGop메인 페이지 제작</p>
		</div>
		<p className="name">사용 기술</p>
		<div className="content">
			<p>JS TS Node.js CSS HTML React</p>
		</div>
	</div>
)

export default MyProfile
