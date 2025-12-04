const CONFIRM_KEY = "U01TX0FVVEgyMDI1MTIwNTA0NDQwNzExNjUzNTE="; // provided raw token
const JUSO_JSONP_URL =
  "https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do";

export interface JusoAddress {
  roadAddr: string;
  roadAddrPart1: string;
  roadAddrPart2: string;
  jibunAddr: string;
  engAddr: string;
  zipNo: string;
  bdNm: string;
  bdMgtSn?: string;
  admCd?: string;
}

interface JusoApiResponse {
  results: {
    common: {
      errorCode: string;
      errorMessage: string;
      totalCount: string;
    };
    juso: JusoAddress[];
  };
}

const SQL_KEYWORDS = [
  "OR",
  "SELECT",
  "INSERT",
  "DELETE",
  "UPDATE",
  "CREATE",
  "DROP",
  "EXEC",
  "UNION",
  "FETCH",
  "DECLARE",
  "TRUNCATE",
];

/**
 * 검색어의 특수문자 및 SQL 예약어를 제거하여 안전하게 만듭니다.
 */
export const sanitizeJusoKeyword = (keyword: string): string => {
  if (!keyword) return "";

  let sanitized = keyword.replace(/[%=><]/g, "");

  SQL_KEYWORDS.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    sanitized = sanitized.replace(regex, "");
  });

  return sanitized.trim();
};

/**
 * 주소 검색 (JSONP 사용, CORS 우회)
 * 가이드 샘플(apiSampleJSON.jsp)와 동일하게 callback 파라미터로 받아 처리합니다.
 */
export const searchJusoAddress = async (
  keyword: string,
  page = 1,
  countPerPage = 10
): Promise<JusoAddress[]> => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("주소 검색은 브라우저에서만 가능합니다.");
  }

  const sanitizedKeyword = sanitizeJusoKeyword(keyword);
  if (!sanitizedKeyword) {
    throw new Error("검색어를 입력해주세요.");
  }

  const callbackName = `__juso_cb_${Date.now()}_${Math.random()
    .toString(16)
    .slice(2)}`;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    const cleanup = () => {
      try {
        delete (window as any)[callbackName];
      } catch (err) {
        console.error(err);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    (window as any)[callbackName] = (data: JusoApiResponse) => {
      cleanup();
      if (!data?.results?.common) {
        reject(new Error("주소 검색 응답을 읽지 못했습니다."));
        return;
      }

      const { errorCode, errorMessage } = data.results.common;
      if (errorCode !== "0") {
        reject(new Error(errorMessage || "주소 검색에 실패했습니다."));
        return;
      }

      resolve(data.results.juso || []);
    };

    const params = new URLSearchParams({
      confmKey: CONFIRM_KEY,
      currentPage: String(page),
      countPerPage: String(countPerPage),
      keyword: sanitizedKeyword,
      resultType: "json",
      callback: callbackName,
    });

    script.src = `${JUSO_JSONP_URL}?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(
        new Error(
          "주소 검색 API 호출에 실패했습니다. 잠시 후 다시 시도해주세요."
        )
      );
    };

    document.body.appendChild(script);
  });
};
