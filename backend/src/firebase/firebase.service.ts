import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!getApps().length) {
      try {
        const serviceAccountPath = path.resolve(
          process.cwd(),
          '..',
          'quick--mate-firebase-adminsdk-fbsvc-a1ff5e9023.json'
        );
        initializeApp({
          credential: cert(require(serviceAccountPath)),
        });
        console.log('Firebase Admin initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Firebase Admin', error);
      }
    }
  }

  getAuth() {
    return getAuth();
  }
}
