// EnvConfig를 런타임 객체로 정의 (주석 반영, 타입 정보 포함)
const EnvConfig = {
  /** 베이스 URL */
  BASE_URL: "string",
  /** 서버 베이스 URL */
  BASE_SERVER_URL: "string",
} as const;

// EnvConfig의 키와 값 타입을 추출
type EnvConfigType = typeof EnvConfig;
type EnvKey = keyof EnvConfigType;

// 결과 타입 정의
type ConfigResult<K extends EnvKey> = EnvConfigType[K] extends "number"
  ? number
  : EnvConfigType[K] extends "boolean"
  ? boolean
  : string;

// window._env_ 타입 정의
interface WindowEnv {
  [key: string]: string | number | boolean;
}
// getEnvVar 함수
function getEnvVar<K extends EnvKey>(key: K): ConfigResult<K> {
  const windowEnv = (window as unknown as { _env_: WindowEnv })._env_ || {};
  const value = windowEnv[`VITE_${key}`] ?? import.meta.env[`VITE_${key}`];

  if (value === undefined) {
    console.warn(
      `Environment variable VITE_${key} is not defined, using default value`
    );
  }

  // boolean 타입인지 확인
  // if (EnvConfig[key] === "boolean") {
  //   return (value === "true" || value === true) as ConfigResult<K>;
  // }

  // number 타입인지 확인
  /*if (EnvConfig[key] === "number") {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new Error(`Environment variable ${key} must be a number`);
    }
    return numValue as ConfigResult<K>;
  }*/

  return value as ConfigResult<K>;
}

export const env = {
  baseUrl: getEnvVar("BASE_URL"),
  baseServerUrl: getEnvVar("BASE_SERVER_URL"),
} as const;
