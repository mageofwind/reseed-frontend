import Service from '@/utils/api/services';
import { useEffect, useReducer, useRef, useState } from 'react';
import create_style from './create.module.scss';
import FormHelper from './formHelper';
import MapPolygon from '../../components/mod-polygon/modedPolygon';
import Swal from 'sweetalert2';
import ls from '@/utils/localStorage/ls';
import React from 'react';
import { Spin } from 'antd';

export default function CreateProjects({ user }) {
	const [structure, setStructure] = useState([]);
	const [pagePos, setPagePos] = useState(0);
	const [final, setFinal] = useState(false);
	const [duplicatorHelper, setDuplicator] = useState([]);
	const polygonDataRef = useRef([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await Service.Structure.getStructure().then((response) => {
			if (response?.data?.pages) {
				setStructure(response.data.pages);
				fixDataHandler(response.data.pages);
			}
		});
	};

	const getStored = () => {
		let savedProject = ls.getStorage('project');
		if (savedProject) {
			const metadata = savedProject;
			return { data: savedProject, dataInputs: metadata };
		} else {
			return { data: {}, dataInputs: {} };
		}
	};

	const dtsReducer = (state, action) => {
		const { type, input = '', data = '' } = action;
		const { name, value, index, category = '' } = input;

		if (type === 'update') {
			if (category !== 'project_information') {
				let stateCopy = { ...state };
				let categoryArray = stateCopy?.dataInputs?.metadata?.[category] || [];

				// if (categoryArray.length === 0) {
				// 	categoryArray = { [name]: value };
				// } else {
				// }
				// categoryArray[index] = { ...categoryArray[index], [name]: value };

				stateCopy.data = {
					...state['data'],
					metadata: { ...state['data']['metadata'] },
					[category]: [...categoryArray.slice(0, index), { ...categoryArray[index], [name]: value }, ...categoryArray.slice(index + 1)]
				};

				stateCopy.dataInputs = {
					...state['dataInputs'],
					metadata: {
						...state['dataInputs']['metadata'],
						[category]: [...categoryArray.slice(0, index), { ...categoryArray[index], [name]: value }, ...categoryArray.slice(index + 1)]
					}
				};

				return stateCopy;
			}

			let stateCopy = {
				...state,
				data: {
					...state['data'],
					metadata: { ...state?.['data']?.['metadata'], [category]: { ...state?.['data']?.['metadata']?.[category], [name]: value } }
				},
				dataInputs: {
					...state['dataInputs'],
					metadata: {
						...state?.['dataInputs']?.['metadata'],
						[category]: { ...state?.['dataInputs']?.['metadata']?.[category], [name]: value }
					}
				}
			};
			return stateCopy;
		}
		if (type === 'setnew') {
			return { ...state, dataInputs: data };
		}
	};

	const [dataToSend, disDataToSend] = useReducer(dtsReducer, getStored());
	const handlePolygonData = (data, category) => {
		polygonDataRef.current = [data];
		disDataToSend({ type: 'update', input: { name: data.attribute, value: data.coords, index: data.index, category: category } });
	};

	const inputsHandler = (event, category) => {
		const { name = '', value = '', index = null } = (event?.target ? event.target : event) ?? {};
		const customAttribute = event?.target?.getAttribute('data-categorie-index') ?? null;
		const customName = event?.target?.getAttribute('data-name') ?? null;

		let validIndex = index === null ? Number(customAttribute) : Number(index);

		const validName = customName ?? name;

		disDataToSend({ type: 'update', input: { name: validName, category: category, index: validIndex, value: value } });
	};

	const addCategorie = (cat) => {
		setStructure((prevStructure) => {
			const copyData = [...prevStructure];
			copyData[pagePos] = {
				...copyData[pagePos],
				categories: [...copyData[pagePos].categories, cat]
			};

			return copyData;
		});

		disFixedData({ type: 'duplicate', category: cat.category });
	};

	const fixReducer = (state, action) => {
		if (action?.type === 'setup' && action?.data) return action.data;
		if (action?.type === 'duplicate') {
			return [...state, duplicatorHelper[action.category]];
		}
		if (action?.type === 'updateData' && action?.newData && action?.title) {
			let newState = state.map((fil) => {
				if (fil.category_label === action.title) {
					const newAttributes = fil['attributes']
						.map((i) => {
							if (Object.keys(action.newData?.[action.category] == i.attribute)) return { ...i, value: action.newData[nd] };
						})
						.flat();
					const newFil = {
						...fil,
						attributes: newAttributes
					};
					return newFil;
				}
				return fil;
			});
			return newState;
		}
		if (action?.type === 'updateData2' && action?.newData && action?.title) {
			let newState = state.map((s) => {
				if (s.category in action.newData) {
					const newAttributes = s.attributes.map((i) => {
						let helper = { ...i, value: action.newData[s.category][i.attribute] || action.newData[s.category][0]?.[i.attribute] };
						return helper;
					});

					const newS = {
						...s,
						attributes: newAttributes
					};
					return newS;
				}
				return s;
			});
			return newState;
		}
	};

	const [fixedData, disFixedData] = useReducer(fixReducer, []);

	const fixDataHandler = (StructData) => {
		//* Fixin the structure
		let cat = StructData.map((a) => a.categories).flat();
		let fix = cat.map((sa) => {
			let helperAttr;

			helperAttr = sa.attributes.map((t) => {
				return { label: t.label, attribute: t.attribute, value: '' };
			});

			const helper = {
				category: sa.category,
				category_label: sa.category_label,
				attributes: helperAttr
			};
			return helper;
		});
		disFixedData({ type: 'setup', data: fix });
		fix.map((dat) => {
			setDuplicator((prev) => ({
				...prev,
				[dat.category]: dat
			}));
		});
	};

	const HandleSubmit = (event, arr) => {
		event.preventDefault();
		console.log(dataToSend)
		if (pagePos === 0) {
			const submitFirstPart = async (obj) => {
				let res = await Service.Project.submitBasicInfo(obj, user.token);
				if (res?.status === 'success') {
					disDataToSend({ type: 'setnew', data: res.data });
					disFixedData({ type: 'updateData', newData: obj, title: arr[0].category_label });
					setPagePos((prev) => prev + 1);
				}
			};
			const metadata = {
				project_information: dataToSend?.data?.metadata?.project_information,
				status: dataToSend?.data?.status,
				ppId: dataToSend?.data?.ppId,
				_id: dataToSend?.data?._id
			};
			submitFirstPart(metadata);
			return;
		}

		if (pagePos <= structure.length - 1) {
			const submitSecondPart = async (obj) => {
				let res = await Service.Project.submitBasicInfo(obj, user.token);
				if (res?.status === 'success') {
					disFixedData({ type: 'updateData2', newData: obj, title: arr[0].category_label });
					setPagePos((prev) => prev + 1);
				}
				return;
			};
			const metadata = {
				project_information: dataToSend?.dataInputs?.metadata?.project_information,
				production_areas: dataToSend?.dataInputs?.metadata?.production_areas,
				status: dataToSend.dataInputs?.status,
				ppId: dataToSend.dataInputs?.ppId,
				_id: dataToSend.dataInputs?._id
			};
			submitSecondPart(metadata);

			if (pagePos === structure.length - 1) {
				setFinal(true);
				return;
			}
			return;
		}
	};

	const miaycoco = async () => {
		setLoading(true);
		let res = await Service.Project.confirmsubmit(dataToSend.dataInputs?._id, user.token);
		if(res) {setLoading(false)}
		if (res.name === 'AxiosError') {
			Swal.fire({
				title: 'oops...',
				text: res.response?.data?.error?.message
			}).then(() => window.location.reload());
			return;
		}
		Swal.fire({
			title: 'its Okey',
			text: 'project submitted'
		});
		window.location.pathname = '/dashboard'
	};

	const minusPage = () => {
		setFinal(false);
		setPagePos((prev) => prev - 1);
	};

	const FormMaker = () => {
		if (structure.length == 0) return <div></div>;
		let page = structure[pagePos];
		let categoryPos = page?.categories?.length ?? 0;

		return (
			<form onSubmit={(e) => HandleSubmit(e, page?.categories)} id={create_style['form']}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<h1 onClick={() => console.log(dataToSend)}>{page?.page_title}</h1>
					{pagePos != 0 ? (
						<a style={{ cursor: 'pointer', color: '#9E977F' }} onClick={() => minusPage()}>
							{'< Back to Form'}
						</a>
					) : (
						''
					)}
				</div>
				<hr />
				<div className={create_style['categores_flex_div']}>
					{page?.categories?.map((cat, key) => (
						<div key={`categorie-${key}`} className={create_style['form_categories']}>
							<h2>{cat.category_label}</h2>
							<div>
								{cat?.attributes?.map((attr, index) => (
									<FormHelper
										attr={{ ...attr, formControllerIndex: key, category: cat?.category }}
										savedData={dataToSend.dataInputs}
										inputsCallback={inputsHandler}
										callback={handlePolygonData}
										key={`formhelper-${index}`}
									/>
								))}
							</div>
							{cat.multirow && key === categoryPos - 1 && (
								<button type="button" className={create_style['addmore_create']} onClick={() => addCategorie(cat)}>
									add more
								</button>
							)}
						</div>
					))}
				</div>
				<button type="submit">Continue</button>
			</form>
		);
	};

	const FinalPage = () => {
		return (
			<div className={create_style['final_page']}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<h1 onClick={() => console.log(dataToSend)}>New Project</h1>
					<a style={{ cursor: 'pointer', color: '#9E977F' }} onClick={() => minusPage()}>
						{'< Back to Form'}
					</a>
				</div>
				<hr />
				<div className={create_style['fp_container']}>
					{fixedData.map((categories, id) => (
						<div key={`finalpage-${id}`} className={create_style['fp_categories']}>
							<input type="checkbox" name={categories?.category} id={`${categories?.category}-${id}`} />
							<label htmlFor={`${categories?.category}-${id}`}>{categories?.category_label}</label>
							<div className={create_style['fp_info_container']}>
								{categories['attributes'].map((attr, id2) => (
									<>
										{attr.attribute === 'production_area_polygon' ? (
											<div key={`${attr?.attribute}-modedpoly-${id}-${id2}`} className={create_style['fp_info_mappoly']}>
												<h4>{attr?.label}</h4>
												<MapPolygon info={attr} />
											</div>
										) : (
											<div key={`${attr?.attribute}-${id}-${id2}`} className={create_style['fp_info_div']}>
												<h4>{attr?.label}</h4>
												{attr?.value && Array.isArray(attr?.value) ? <span>{attr?.value.join(', ')}</span> : <span>{attr?.value}</span>}
											</div>
										)}
									</>
								))}
							</div>
						</div>
					))}
				</div>
				<button onClick={() => miaycoco()}>Submit</button>
			</div>
		);
	};

	return (
		<div id={create_style['whiteContainer']}>
			<Spin spinning={loading}>{final ? <FinalPage /> : FormMaker()}</Spin>
		</div>
	);
}
