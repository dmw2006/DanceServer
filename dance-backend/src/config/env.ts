import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

const candidatePaths = [
	path.resolve(__dirname, '../../../.env'), // project root when compiled to dist
	path.resolve(__dirname, '../../.env'), // project root when running ts-node/tsx from src
	path.resolve(__dirname, '../.env'), // fallback to server/.env
	path.resolve(process.cwd(), '.env'),
	path.resolve(process.cwd(), '../.env'),
];

for (const envPath of candidatePaths) {
	if (fs.existsSync(envPath)) {
		config({ path: envPath });
		break;
	}
}
