import test from 'node:test'; import assert from 'node:assert/strict';
import { rankPlans } from '../../js/engine/ranking.js';
test('ranks only clearly eligible plans by monthly payment', () => { const r = rankPlans([{planId:'a', monthlyPaymentNowCents:200,totalBorrowerPaymentsCents:1,eligibility:{status:'clearly_eligible'}},{planId:'b',monthlyPaymentNowCents:100,totalBorrowerPaymentsCents:1,eligibility:{status:'potentially_eligible'}}]); assert.equal(r.length,1); assert.equal(r[0].planId,'a'); });
