import test from 'node:test'; import assert from 'node:assert/strict';
import { estimatePslf } from '../../js/engine/history/pslf.js';
test('estimates remaining PSLF payments', () => { const r = estimatePslf({ publicService:true, pslfMonths:110 }, { projectedResolutionMonth:120, monthlyPaymentNowCents:10000, monthly:Array.from({length:120},()=>({endingBalanceCents:500000})) }); assert.equal(r.remainingQualifyingPayments, 10); });
