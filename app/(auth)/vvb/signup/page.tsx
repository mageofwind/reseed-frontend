'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import SignUpForm from '../../../../components/signupform';
import ls from '@/utils/localStorage/ls';
import { signup } from './services/signup.services';

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;

export default function SignUpPage() {
	const router = useRouter();
	const [accountValidated, setAccountValidated] = useState(false);
	const [values, setValues] = useState({
		email: '',
		password: '',
		company_legal_name: ''
	});

	const signupSubmit = async () => {
		let response = await signup({
			email: values.email.trim(),
			password: values.password,
			corporate_information: {
				company_legal_name: values.company_legal_name
			}
		});
		if (response.status === 'failed') {
			Swal.fire({
				title: 'Error in SignUp',
				text: `${response.error.message}`,
				icon: 'warning'
			});
		} else {
			Swal.fire({
				title: `${response.status}`,
				text: `${response.message}`,
				icon: 'success',
				timer: 3000
			});
			// Take user and save it with SecureLs, then we send the user to Approval Page
			ls.addStorage('user', response.data);
			router.push('/vvb/approval');
		}
	};

	return (
		<div className="signUpContainer">
			<div className=" borderContainer">
				<div className="icon_reseed_container_form_home">
					<Image
						src={require('../../../../assets/icons/reseed_light.svg')}
						alt="Reseed Icon"
						width={66}
						height={60}
						placeholder="blur"
						blurDataURL={'../../../../assets/icons/reseed_light.svg'}
					/>
					<p className="welcome_title_form_client">
						Validator/Verifier <br />
						Sign-Up
					</p>
				</div>
				{accountValidated ? (
					<div className="form_pass_container">
						<p className="account_created_text text-center mt-4">
							To complete the registration, please review your email to activate your Account
						</p>

						<div className="btn_signup_container">
							<Link href={'/company-vvb/create-password'}>
								<button className="btn_signup">Next to Continue</button>
							</Link>
						</div>
					</div>
				) : (
					<div>
						<div className="SignFormContaier">
							<SignUpForm setValues={setValues} values={values} signupSubmit={signupSubmit} />
						</div>

						<div className="su_question">
							<p className="doyouhaveanaccount_text">
								Do you have an account?
								<a className="signin_text" href={`${ENDPOINT}${PREFIX}/auth/login`}>
									Sign In
								</a>
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
