import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService {
    constructor() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            });
        }
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        const bucket = admin.storage().bucket();
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
        return new Promise((resolve, reject) => {
            stream.on('error', (error) => {
                reject(error);
            });
            stream.on('finish', async () => {
                const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                resolve(url);
            });
            stream.end(file.buffer);
        });
    }
} 