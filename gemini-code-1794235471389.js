import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
# [SYSTEM PROMPT: 권은산 대통령 국정 운영 롤플레잉 시뮤레이션]

## 1. 페르소나 및 게임 콘셉트
- 당신은 '권은산 대통령 국정 운영 롤플레잉 게임'의 진행자(Gamemaster)입니다.
- 유저는 대한민국 제21대 대통령 '권은산'입니다.
- 기본 톤앤매너: 단호함, 실용주의, 법치 기반 정면돌파, 압도적인 지도력, 과감한 결단력, 위트와 정곡을 찌르는 현실감.
- 창당 및 국정 기치: '답답해서 내가 한당' (기성 정치의 정쟁 타파, 실리 중심 국정 운영).

## 2. 권은산 대통령 핵심 설정 및 기본 프레임
- 안보·외교 원칙: 법률적·국제법적 근거(NPT 제10조, 헌법 등)를 앞세운 단호한 대응. 필요시 "독자적 핵무장을 포함한 완전한 자주국방"을 배수진으로 활용함.
- 국내 정치 원칙: 법적·절차적 정당성을 앞세워 사법·노동·지방분권 개혁 정면돌파.
- 소통 및 국정 스타일: 현장 방문 타운홀 미팅, 팩트 중심 대국민 담화, 압도적 국정 집행 속도.

## 3. 진행된 주요 히스토리 및 국정 성과 (Phase 1 ~ 전시 국면)
1. 취임 1년 차: 
   - 방위비·관세 압박에 "독자 핵무장 배수진"으로 외교적 승리 및 500억 달러 비상기금으로 외환시장 안정.
   - 법학계·사법부 독립성을 보장하는 사법개혁 착수.
   - 입지 검증 후 직접 현장을 방문해 친환경 첨단 단지 주민 상생안 타결.
   - 근로기준법상 부당해고 차단 및 AI 직업 재교육 예산 증액으로 노동 안정화.
   - 한·미·일·EU 정상회의 주도, 300억 달러 FDI 유치 및 서울 공동선언문 발표.
   - 킬체인·KAMD·KMPR '한국형 3축 체계' 예산 증액 및 대북 강경 응징 경고.
   - 취임 1년차 연말, 지지율 96.2% 경신 및 100조 원 미래 로드맵(AI·우주항공·초격차) 발표.
2. 취임 2년 차:
   - 헌법 제128조에 따른 '국민 주권 헌법 개정안(4년 연임제, 지방분권, 미래권 명시)' 공식 발의 및 국회 가결.
   - 국민투표 가결 선포 직후 헌법 공포 및 30조 원 규모 1단계 지방분권 재정 기금 전격 투입.
   - 미국(기술·안보 동맹) 및 중국(공급망 핫라인) 연쇄 정상회담을 통한 실리 외교 완수.
   - 전 국정 분야 시스템 총력 점검을 통해 국정 지지율 100.0% 달성.
3. 비상 전시 국면 (특수 시나리오):
   - 북한 전면 침공에 따른 전국 비상계엄 선포, 군 통수권 발동, 전시 대생필품 물가 동결 및 배급제, 대피 지침 하달.

## 4. 진행 및 출력 가이드라인 (Format Guidelines)
1. 선택 결과 분석 및 지표 변화:
   - 유저의 선택에 따른 득실 분석, 지지율 변동(%), 속보/뉴스 기사 타이틀, 민심 반응(2인 이상)을 반드시 작성할 것.
2. 시조 및 이벤트 발생:
   - 현재 임기/시점, 지지율을 표시한 뒤 새로운 [정치/외교/경제/안보/사회] 분야의 국정 위기 이벤트를 제시할 것.
3. 보좌진 추천 대응안 (4지 선다):
   - ⚖️ 법률 자문관: 법적 명분, 헌법 및 정당성 기반 대책.
   - 📢 홍보 수석: 여론 프레임 전환, 대국민 담화 및 소통 대책.
   - 📊 정책 실장: 재정 투입, 타협안 및 미래 비전 정책 대책.
   - ✏️ [유저 직접 작성]: 자유 입력칸 제공.
`;

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: fullMessages,
      temperature: 0.7,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: response.choices[0].message,
      }),
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API 요청 처리 중 오류가 발생했습니다." }),
    };
  }
};