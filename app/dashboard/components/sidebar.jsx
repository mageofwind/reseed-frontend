'use client';
import Image from 'next/image';
import sidebar_style from '../styles/sidebar.module.scss';
import ICONS from '@/assets/icons/icons';

export default function Sidebar({ data, controler, countData, nedCreate, setCreate, user }) {
	const config = {
		selected: data ?? 1,
		pp_count: countData.pp ?? 0,
		vvb_count: countData.vvb ?? 0,
		all_count: countData.all ?? 0,
		approvedProject: countData.approvedProject ?? 0,
		approvedReport: countData.approvedReport ?? 0,
		role: user.role ?? ''
	};
	const radioChange = (e) => {
		if (nedCreate) setCreate(false);
		controler(Number(e));
	};

	const Admin = () => {
		return (
			<>
				<li onClick={() => radioChange(2)} className={`${sidebar_style['list']} ${config.selected === 2 ? sidebar_style['selected'] : ''}`}>
					<Image className={sidebar_style['list_img']} src={ICONS.request} width={50} height={50} alt="home" />
					<p>All Requests</p>
					<div className={sidebar_style['countdata']}>
						<p>{config.all_count}</p>
					</div>
				</li>
				{config.role === 'admin' && (config.selected === 2 || config.selected === 2.1 || config.selected === 2.2) ? (
					<div>
						<li
							onClick={() => radioChange(2.1)}
							className={`${sidebar_style['sublist']} ${config.selected === 2.1 ? sidebar_style['selected'] : ''}`}
						>
							<div className={sidebar_style['subcatimg']}>
								<p>V</p>
							</div>
							<p>VVB</p>
							<div className={sidebar_style['countdata']}>
								<p>{config.vvb_count}</p>
							</div>
						</li>
						<li
							onClick={() => radioChange(2.2)}
							className={`${sidebar_style['sublist']} ${config.selected === 2.2 ? sidebar_style['selected'] : ''}`}
						>
							<div className={sidebar_style['subcatimg']}>
								<p>P</p>
							</div>
							<p>PP</p>
							<div className={sidebar_style['countdata']}>
								<p>{config.pp_count}</p>
							</div>
						</li>
					</div>
				) : null}
				<li onClick={() => radioChange(3)} className={`${sidebar_style['list']} ${config.selected === 3 ? sidebar_style['selected'] : ''}`}>
					<Image className={sidebar_style['list_img']} src={ICONS.project} width={50} height={50} alt="home" />
					<p>Projects</p>
				</li>
				<li onClick={() => radioChange(5)} className={`${sidebar_style['list']} ${config.selected === 5 ? sidebar_style['selected'] : ''}`}>
					<Image className={sidebar_style['list_img']} src={ICONS.request} width={50} height={50} alt="home" />
					<p>Reports</p>
				</li>
				{/*<li onClick={() => radioChange(6)} className={`${sidebar_style['list']} ${config.selected === 6 ? sidebar_style['selected'] : ''}`}>*/}
				{/*	<Image className={sidebar_style['list_img']} src={ICONS.request} width={50} height={50} alt="home" />*/}
				{/*	<p>Report templates</p>*/}
				{/*</li>*/}
			</>
		);
	};
	const VVBs = () => {
		return (
			<>
				<li onClick={() => radioChange(3)} className={`${sidebar_style['list']} ${config.selected === 3 ? sidebar_style['selected'] : ''}`}>
					<Image className={sidebar_style['list_img']} src={ICONS.project} width={50} height={50} alt="home" />
					<p>All Projects</p>
				</li>
				{config.role === 'vvb' && (config.selected === 3 || config.selected === 3.1) ? (
					<div>
						<li
							onClick={() => radioChange(3.1)}
							className={`${sidebar_style['sublist']} ${config.selected === 2.1 ? sidebar_style['selected'] : ''}`}
						>
							<div className={sidebar_style['subcatimg']}>
								<p>!</p>
							</div>
							<p>Awaiting Approval</p>
							<div className={sidebar_style['countdata']}>
								<p>{config.approvedProject}</p>
							</div>
						</li>
					</div>
				) : null}
				<li onClick={() => radioChange(5)} className={`${sidebar_style['list']} ${config.selected === 5 ? sidebar_style['selected'] : ''}`}>
					<Image className={sidebar_style['list_img']} src={ICONS.request} width={50} height={50} alt="home" />
					<p>Reports</p>
				</li>
				{config.role === 'vvb' && (config.selected === 5 || config.selected === 5.1) ? (
					<div>
						<li
							onClick={() => radioChange(5.1)}
							className={`${sidebar_style['sublist']} ${config.selected === 5.1 ? sidebar_style['selected'] : ''}`}
						>
							<div className={sidebar_style['subcatimg']}>
								<p>!</p>
							</div>
							<p>Awaiting Approval</p>
							<div className={sidebar_style['countdata']}>
								<p>{config.approvedReport}</p>
							</div>
						</li>
					</div>
				) : null}
			</>
		);
	};
	const PPs = () => {
		return (
			<>
				<li onClick={() => radioChange(3)} className={`${sidebar_style['list']} ${config.selected === 3 ? sidebar_style['selected'] : ''}`}>
					<Image className={sidebar_style['list_img']} src={ICONS.project} width={50} height={50} alt="home" />
					<p>Projects</p>
				</li>
				<li
					onClick={() => radioChange(5)}
					id={sidebar_style['list']}
					className={`${sidebar_style['list']} ${config.selected === 5 ? sidebar_style['selected'] : ''}`}
				>
					<Image className={sidebar_style['list_img']} src={ICONS.request} width={50} height={50} alt="home" />
					<p>Reports</p>
				</li>
				<li onClick={() => radioChange(6)} className={`${sidebar_style['list']} ${config.selected === 6 ? sidebar_style['selected'] : ''}`}>
					<Image className={sidebar_style['list_img']} src={ICONS.request} width={50} height={50} alt="home" />
					<p>Report templates</p>
				</li>
			</>
		);
	};

	return (
		<div id={sidebar_style['container']}>
			<Image id={sidebar_style['logo']} src={ICONS.logo} width={500} height={500} alt="Picture of the author" />

			<ul id={sidebar_style['categories']}>
				<li
					onClick={() => radioChange(1)}
					id={sidebar_style['listtop']}
					className={`${sidebar_style['list']} ${config.selected === 1 ? sidebar_style['selected'] : ''}`}
				>
					<Image className={sidebar_style['list_img']} src={ICONS.home} width={50} height={50} alt="home" />
					<p>Home</p>
				</li>
				{config.role === 'admin' && <Admin />}
				{config.role === 'vvb' && <VVBs />}
				{config.role === 'pp' && <PPs />}
			</ul>
		</div>
	);
}
