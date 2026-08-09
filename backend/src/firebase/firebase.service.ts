import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!getApps().length) {
      try {
        // Check if we should use environment variables instead of file
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
          initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
          });
          console.log('Firebase Admin initialized successfully from env variables');
        } else {
          const serviceAccountPath = path.resolve(
            process.cwd(),
            '..',
            'quick--mate-firebase-adminsdk-fbsvc-a1ff5e9023.json'
          );
          initializeApp({
            credential: cert(require(serviceAccountPath)),
          });
          console.log('Firebase Admin initialized successfully from file');
        }
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
      }
    }
  }

  getAuth() {
    return getAuth();
  }
}
