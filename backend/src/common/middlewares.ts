import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseService } from '../user/firebase/firebase.service';

@Injectable()
export class Authorize implements NestMiddleware {
	constructor(private firebaseService: FirebaseService) {}
	use(req: Request, res: Response, next: NextFunction) {
		if (req.headers?.authorization) {
			const token = req.headers.authorization.replace('Bearer ', '');
			if (token) {
				this.firebaseService.verifyToken(token).then((user) => {
					req['user'] = user;
					next();
				}).catch(err => {
					return res.status(401).json('Invalid Token')
				})
			}
		} else
		return res.status(401).json('Invalid Token')
	}
}

@Injectable()
export class AuthorizeTeacher implements NestMiddleware {
	constructor(private firebaseService: FirebaseService) {}
	use(req: Request, res: Response, next: NextFunction) {
		if (req.headers?.authorization) {
			const token = req.headers.authorization.replace('Bearer ', '');
			if (token) {
				this.firebaseService.verifyToken(token).then(user => {
					if (user.role === 'teacher') {
						req['user'] = user;
						next();
					}
				}).catch(err => {
					return res.status(401).json('Invalid Token')
				})
			}
		} else
		return res.status(401).json('Invalid Token')
	}
}
