"use client"

import { useEffect, useRef, useState } from 'react';
import fh from '../formHelper.module.scss';
import Service from '@/utils/api/services';
const ESTRUCTUREPOINT = process.env.NEXT_PUBLIC_API_ESTRUCTURE;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
import axios from 'axios';

interface data {
	attribute: string;
	hint: string;
	label: string;
	multiline: boolean;
	required: boolean;
	type: string;
	options: string;
	API: string;
	minrows: number;
	multirow: boolean;
	allowed_mime_types: Array<[]>;
	formControllerIndex: number;
	category: string;
}

interface SavedData {
	[key: string]: string | any;
}

const comproveData = (savedData: SavedData, info?: data) => {
	if (Object.keys(savedData).length === 0) return false;
	return true;
};

const InputText = ({ info, savedData, callback }: { info: data; savedData: SavedData; callback: Function }) => {
	const value = savedData?.[info.category]?.[info.formControllerIndex]?.[info.attribute] || savedData?.[info.category]?.[info.attribute] || '';
	if (info.multiline) {
		return (
			<div className={fh['input_div']}>	
				<label htmlFor={`${info.attribute}-${info.formControllerIndex}`}>{info.label}</label>
				<textarea
					name={info.attribute}
					id={`${info.attribute}-${info.formControllerIndex}`}
					required={info.required}
					placeholder={info.hint}
					value={value}
					rows={5}	
					onChange={(e) => callback(e.target.value, info)}
					data-categorie-index={info.formControllerIndex}
				/>
			</div>
		);
	}
	return (
		<div className={fh['input_div']}>
			<label htmlFor={`${info.attribute}-${info.formControllerIndex}`}>{info.label}</label>
			<input
				type="text"
				name={info.attribute}
				id={`${info.attribute}-${info.formControllerIndex}`}
				required={info.required}
				placeholder={info.hint}
				value={value}
				onChange={(e) => callback(e.target.value, info)}
				data-categorie-index={info.formControllerIndex}
			/>
		</div>
	);
};

const SelectStatic = ({ info, savedData, callback }: { info: data; savedData: SavedData; callback: Function }) => {
	const [dynInfo, setDynInfo] = useState<[]>([]);
	const selectRef = useRef<HTMLSelectElement | null>(null);
	const value = savedData?.[info.category]?.[info.formControllerIndex]?.[info.attribute] || savedData?.[info.category]?.[info.attribute] || '';

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(`${ESTRUCTUREPOINT}/project/list?name=ProductionDestinyList`).then((response) => response);
			setDynInfo(response.data.data.list);
		};
		if (info.options) fetchData();
	}, []);

	useEffect(() => {
		if (selectRef.current && selectRef.current.value) {
			let data = {
				name: selectRef.current.name,
				value: selectRef.current.value,
				index: info.formControllerIndex
			};
			callback(selectRef.current?.value, info);
		}
	}, [dynInfo]);

	return (
		<div className={fh['select_div_static']}>
			<label htmlFor={`${info.attribute}-${info.formControllerIndex}`}>{info.label}</label>
			<select
				ref={selectRef}
				name={info.attribute}
				id={`${info.attribute}-${info.formControllerIndex}`}
				data-categorie-index={info.formControllerIndex}
				value={value}
				onChange={(e) => callback(e.target.value, info) ?? undefined}
			>
				{dynInfo.map((listInfo: any, id: number) => (
					<option key={`${info.attribute}-staticselect-${id}`} value={listInfo.value}>
						{listInfo?.Description}
					</option>
				))}
			</select>
		</div>
	);
};

const SelectDynamic = ({ info, savedData, callback }: { info: data; savedData: SavedData; callback: Function }) => {
	const [dynInfo, setDynInfo] = useState<[]>([]);
	const selectRef = useRef<HTMLSelectElement | null>(null);
	const value = savedData?.[info.category]?.[info.formControllerIndex]?.[info.attribute] || savedData?.[info.category]?.[info.attribute] || '';
	console.log(value);
	useEffect(() => {
		const fetchData = async () => {
			let res = await Service.Structure.getDynamicList(`${API_ENDPOINT}${API_PREFIX}/user/approvedVVBs`);
			setDynInfo(res.data.list);
		};
		if (info.API) fetchData();
	}, []);

	useEffect(() => {
		if (selectRef.current && selectRef.current.value) {
			let data = {
				name: selectRef.current.name,
				value: selectRef.current.value,
				index: info.formControllerIndex
			};
			callback(data.value, info);
		}
	}, [dynInfo]);

	return (
		<div className={fh['select_div_dyn']}>
			<label htmlFor={`${info.attribute}-${info.formControllerIndex}`}>{info.label}</label>
			<select
				ref={selectRef}
				name={info.attribute}
				id={`${info.attribute}-${info.formControllerIndex}`}
				data-categorie-index={info.formControllerIndex}
				value={value}
				onChange={(e) => callback(e.target.value, info) ?? undefined}
			>
				{dynInfo.map((listInfo: any, id: number) => (
					<option key={`${info.attribute}-dynselect-${id}`} value={listInfo?.value}>
						{listInfo?.description}
					</option>
				))}
			</select>
		</div>
	);
};

const MultiSelect = ({ info, savedData, callback }: { info: data; savedData: SavedData; callback: Function }) => {
	const [dynInfo, setDynInfo] = useState<any>([]);
	const [msData, setMsData] = useState<any>([]);
	const value = savedData?.[info.category]?.[info.formControllerIndex]?.[info.attribute] || savedData?.[info.category]?.[info.attribute] || [];

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(`${ESTRUCTUREPOINT}/project/list?name=TechniquesList`).then((response) => response);
			setDynInfo(response.data.data.list);
			setMsData(value);
		};
		if (info.options) fetchData();
	}, []);

	const handleMultiSelect = (event: any, index: any) => {
		const { name, value, checked } = event.target;
		if (checked) {
			let actual = { name: name, value: [...msData, value] };
			setMsData((prev: string[]) => [...prev, value]);
			callback(actual.value, info);
			return;
		}
		let filter = msData.filter((i: string) => i !== value);
		setMsData(filter);
		let actual = { name: name, value: filter };
		callback(actual.value, info);
	};

	return (
		<div className={fh['multi_div']}>
			<h3>{info.label}</h3>
			<div>
				{dynInfo.map((listInfo: any, id: number) => (
					<label htmlFor={`${info.attribute}-${info.formControllerIndex}-${id}`} key={`${info.attribute}-multiselect-${id}`}>
						<input
							type="checkbox"
							name={info.attribute}
							checked={value.includes(listInfo?.value)}
							id={`${info.attribute}-${info.formControllerIndex}-${id}`}
							onChange={(e) => handleMultiSelect(e, info.formControllerIndex)}
							value={listInfo.value}
						/>
						{listInfo?.Description}
					</label>
				))}
			</div>
		</div>
	);
};

const Booleano = ({ info, savedData, callback }: { info: data; savedData: SavedData; callback: Function }) => {
	const boolean = savedData?.[info.category]?.[info.formControllerIndex]?.[info.attribute] ?? '';
	return (
		<div className={fh['boolean_div']}>
			<label htmlFor={`${info.attribute}-${info.formControllerIndex}`}>{info.label}</label>
			<div>
				<label htmlFor={`${info.attribute}-${info.formControllerIndex}-1`} className={'d-flex align-items-center'}>
					<input
						type="radio"
						name={`${info.attribute}-${info.formControllerIndex}`}
						id={`${info.attribute}-${info.formControllerIndex}-1`}
						value={'yes'}
						checked={boolean === 'yes'}
						onChange={(e) => callback(e.target.value, info) ?? undefined}
						data-name={info.attribute}
						className={'me-1'}
						data-categorie-index={info.formControllerIndex}
					/>
					Yes
				</label>
				<label htmlFor={`${info.attribute}-${info.formControllerIndex}`} className={'d-flex align-items-center'}>
					<input
						type="radio"
						name={`${info.attribute}-${info.formControllerIndex}`}
						id={`${info.attribute}-${info.formControllerIndex}-2`}
						checked={boolean === 'no'}
						value={'no'}
						onChange={(e) => callback(e.target.value, info) ?? undefined}
						data-name={info.attribute}
						className={'me-1'}
						data-categorie-index={info.formControllerIndex}
					/>
					No
				</label>
			</div>
		</div>
	);
};

const Date = ({ info, savedData, callback }: { info: data; savedData: SavedData; callback: Function }) => {
	const dateRef = useRef<HTMLInputElement | null>(null);
	const value = savedData?.[info.category]?.[info.formControllerIndex]?.[info.attribute] ?? '';

	useEffect(() => {
		if (dateRef.current) {
			let data = { name: dateRef.current.name, value: dateRef.current.value, index: info.formControllerIndex };
			callback(data.value, info);
		}
	}, []);

	return (
		<div className={fh['input_div']}>
			<label htmlFor={`${info.attribute}-${info.formControllerIndex}`}>{info.label}</label>
			<input
				ref={dateRef}
				type="date"
				name={info.attribute}
				id={`${info.attribute}-${info.formControllerIndex}`}
				required={info.required}
				value={value}
				className="w-100"
				onChange={(e) => callback(e.target.value, info) ?? undefined}
				data-categorie-index={info.formControllerIndex}
			/>
		</div>
	);
};

const DInput = {
	InputText,
	SelectStatic,
	SelectDynamic,
	MultiSelect,
	Booleano,
	Date
};
export default DInput;
