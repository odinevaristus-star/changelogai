import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-changelog-entry-flow.ts';
import '@/ai/flows/generate-feature-summary-flow.ts';