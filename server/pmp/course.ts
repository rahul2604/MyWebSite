/*
 * The PMP learning path: modules in their unlock order, then the two mock tests and the
 * final assessment. Everything here stays on the server (see server/pmp/types.ts).
 */
import type { Exam, Module } from './types.ts';
import { M00 } from './content/m00.ts';
import { M01 } from './content/m01.ts';
import { M02 } from './content/m02.ts';
import { M03 } from './content/m03.ts';
import { M04 } from './content/m04.ts';
import { M05 } from './content/m05.ts';
import { M06 } from './content/m06.ts';
import { M07 } from './content/m07.ts';
import { M08 } from './content/m08.ts';
import { M09 } from './content/m09.ts';
import { M10 } from './content/m10.ts';
import { M11 } from './content/m11.ts';
import { M12 } from './content/m12.ts';
import { M13 } from './content/m13.ts';
import { M14 } from './content/m14.ts';
import { M15 } from './content/m15.ts';
import { M16 } from './content/m16.ts';
import { M17 } from './content/m17.ts';
import { MOCK1 } from './content/mock1.ts';
import { MOCK2 } from './content/mock2.ts';
import { FINAL } from './content/final.ts';

export const MODULES: Module[] = [M00, M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17];

/** In unlock order: Mock 1 after all modules, Mock 2 after Mock 1 is submitted, final after Mock 2 is submitted. */
export const EXAMS: Exam[] = [MOCK1, MOCK2, FINAL];

export const COURSE_TITLE = 'PMP Exam Preparation: PMBOK Guide 6th Edition and Agile Practice Guide';
export const COURSE_VERSION = '2026.10';
