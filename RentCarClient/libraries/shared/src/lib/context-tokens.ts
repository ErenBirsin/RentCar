import { HttpContextToken } from '@angular/common/http';

export const SKIP_ERROR_HANDLER = new HttpContextToken<boolean>(() => false);
