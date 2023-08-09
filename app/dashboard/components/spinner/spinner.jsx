import { Spinner } from 'reactstrap';

export default  ({text, type}) => {
	return (
		<div style={{...type, position: 'absolute', top: 0, left: 0, zIndex: 10, minHeight: 300, width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0, 0.3)',	color: '#005431'}}>
			<div className="text-center">
				<Spinner>{text}</Spinner>
				<div>{text}</div>
			</div>

		</div>
	)
}