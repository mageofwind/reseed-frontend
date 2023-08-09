import Image from 'next/image';
import ICONS from '@/assets/icons/icons';
import create_report_style from './create_report.module.scss';

export default function StatusChanging(props) {
	return (
		<div>
			<div className="d-flex align-items-center">
				<div className="d-flex align-items-center">
					<div style={{color: '#9e977f', fontSize: 14}}>status</div>
					<div className={`d-flex justify-content-center align-items-center ${create_report_style[`${props.status}Btn`]}`}>
						<Image  src={ICONS[props.status]} width={22} height={50} alt="home" />
					</div>

				</div>
				<span className={create_report_style[`${props.status}_font`]}>{props.status}</span>
			</div>
		</div>
	);
}
