import { Injectable } from '@nestjs/common';
import { initializeApp, applicationDefault, getApp, getApps } from 'firebase-admin/app';
import {getAuth, UserRecord} from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
	app;
	auth;
	constructor() {
		this.app = getApps.length === 0 ? initializeApp({
			credential: applicationDefault()
		}): getApp()
		this.auth = getAuth(this.app)
	}
	
	async signupWithRole ({ name, email, password, customClaims }:
		                      { name: string, email: string, password: string, customClaims: any }) {
		const newUser: UserRecord = await this.auth.createUser({
			email,
			password,
			displayName: name,
		});
		await this.auth
			.setCustomUserClaims(newUser.uid, customClaims)
		return await this.auth.createCustomToken(newUser.uid);
	}
	
	async getAllTeachers () {
		const users: UserRecord[] = (await this.auth.listUsers()).users;
		return users.filter(user => user.customClaims.role === 'teacher')
	}
	
	
	async getAllStudents () {
		const users: UserRecord[] = (await this.auth.listUsers()).users;
		return users.filter(user => user.customClaims.role === 'student').map(student => ({ uid: student.uid, displayName: student.displayName }))
	}
	
	async getStudentByUids (uids: string[]) {
		const users: UserRecord [] = await this.auth.getUsers(uids.map(uid => ({ uid })));
		return users;
	}
	
	async verifyToken (token) {
		return this.auth.verifyIdToken(token)
	}
}
