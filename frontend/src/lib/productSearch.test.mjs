import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchProducts } from './productSearch.mjs';
test('브랜드와 상품명을 공백 및 대소문자와 무관하게 검색', () => {
 assert.equal(searchProducts([{id:1,brand:'CHANEL',name:'클래식 백',price:'50000'}], ' chanel 클래식 ').length,1);
 assert.equal(searchProducts([{id:1,title:'샤넬 백',price:0}], '구찌').length,0);
});
test('잘못된 응답은 빈 결과로 숨기지 않음', () => {
 assert.throws(() => searchProducts({message:'error'}, '샤넬'));
 assert.throws(() => searchProducts([null], '샤넬'));
});
test('영문 및 한글 브랜드 별칭 상호 호환 검색 (chanel <-> 샤넬)', () => {
 assert.equal(searchProducts([{id:1,brand:'샤넬',title:'클래식 플랩 백',price:50000}], 'chanel').length, 1);
 assert.equal(searchProducts([{id:2,brand:'루이비통',title:'모노그램 토트백',price:60000}], 'louis vuitton').length, 1);
});
