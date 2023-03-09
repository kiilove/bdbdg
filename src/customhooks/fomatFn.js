export const addComma = (value) => {
  if (!value) return ""; // 값이 없으면 빈 문자열 반환
  const regex = /\B(?=(\d{3})+(?!\d))/g;
  return value.toString().replace(regex, ","); // 콤마 찍은 문자열 반환
};

export const removeComma = (value) => {
  if (!value) return ""; // 값이 없으면 빈 문자열 반환
  return value.replace(/,/g, "");
};
