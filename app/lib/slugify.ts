// heading id / TOC 링크에 공통으로 쓰는 slugify.
// \p{L}(유니코드 letter, 한글 포함)·\p{N}(숫자)만 남겨 한글 제목도 안전하게 슬러그화.
export function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // 공백 → -
    .replace(/&/g, '-and-') // & → and
    .replace(/[^\p{L}\p{N}\-]+/gu, '') // 문자/숫자/하이픈 외 제거 (한글 유지)
    .replace(/\-\-+/g, '-') // 중복 하이픈 정리
    .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
}
