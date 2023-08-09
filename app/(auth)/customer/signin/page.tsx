import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import LoginForm from '../../../../components/loginForm';

export default function page() {
	return (
		<div className='passWordContainer'>
			<div className='borderContainer signUpForm'>
				<div className='icon_reseed_container_form_home'>
					<Image
						src={require('../../../../assets/icons/reseed_light.svg')}
						alt='Reseed Icon'
						width={66}
						height={60}
						placeholder='blur'
						blurDataURL={'../../../../assets/icons/reseed_light.svg'}
					/>
					<p className='welcome_title_form_client'>Project Proponent Sign-In</p>
				</div>
				<div className='loginFormContainer'>
					<LoginForm />
				</div>
				<div className='su_question'>
					<Link href={'/pp/reset-password'}>
						<p className='signin_text'>Forgot your password?</p>
					</Link>
				</div>
				<div className='su_question'>
					<p className='doyouhaveanaccount_text'>Don`t have an account?</p>
					<Link href={'/pp/signup'}>
						<p className='signin_text'>Sign Up</p>
					</Link>
				</div>
			</div>
		</div>
	);
}
