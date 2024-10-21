// 프로젝트/스터디
export const PostTypeCode = {
  0: '0',
  1: '1',
  2: '2',
} as const;

// 온/오프라인
export const PostOnlineOrOfflineCode = {
  ALL: 'ALL',
  on: 'on',
  off: 'off',
  onOff: 'onOff',
} as const;

// 모집인원
export const PostRecruitsCode = {
  und: 'und',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  mo: 'mo',
} as const;

// 연락방법
export const PostContactTypeCode = {
  ok: 'ok',
  pk: 'pk',
  em: 'em',
  gf: 'gf',
} as const;

// 예상진행기간
export const PostExpectedPeriodCode = {
  und: 'und',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  mo: 'mo',
} as const;

export const PostPositionsCode = {
  ALL: 'ALL',
  FE: 'FE',
  BE: 'BE',
  DE: 'DE',
  IOS: 'IOS',
  AND: 'AND',
  DEVOPS: 'DEVOPS',
  PM: 'PM',
  PD: 'PD',
} as const;

// 경력
export const UserWorkExperienceCode = {
  0: '0년',
  '1': '1년',
  '2': '2년',
  '3': '3년',
  '4': '4년',
  '5': '5년',
  '6': '6년',
  '7': '7년',
  '8': '8년',
  '9': '9년',
  '10': '10년 이상',
} as const;

// URL Type
export const UserUrlType = {
  Link: 'Link',
  Behance: 'Behance',
  Brunch: 'Brunch',
  Dribble: 'Dribble',
  Facebook: 'Facebook',
  GitHub: 'GitHub',
  Instargram: 'Instargram',
  LinkedIn: 'LinkedIn',
  Naverblog: 'Naverblog',
  Notefolio: 'Notefolio',
  Notion: 'Notion',
  Pinterest: 'Pinterest',
  Youtube: 'Youtube',
  Twitter: 'Twitter',
  Tistory: 'Tistory',
  Velog: 'Velog',
} as const;

export const PostLanguageCode = {
  javascript: 'javascript',
  typescript: 'typescript',
  react: 'react',
  vue: 'vue',
  nodejs: 'nodejs',
  spring: 'spring',
  java: 'java',
  nextjs: 'nextjs',
  nestjs: 'nestjs',
  express: 'express',
  go: 'go',
  c: 'c',
  python: 'python',
  django: 'django',
  swift: 'swift',
  kotlin: 'kotlin',
  mysql: 'mysql',
  mongodb: 'mongodb',
  php: 'php',
  graphql: 'graphql',
  firebase: 'firebase',
  reactnative: 'reactnative',
  unity: 'unity',
  flutter: 'flutter',
  aws: 'aws',
  kubernetes: 'kubernetes',
  docker: 'docker',
  git: 'git',
  figma: 'figma',
  zeplin: 'zeplin',
  udemy: 'udemy',
} as const;

// 알림 발생 유형
export const NotificationCode = {
  comment: 'comment',
  signup: 'signup',
} as const;

// 알림 발생 유형 type
export type NotificationType = 'comment' | 'signup';

// 공모전 구분
export const EventTypeCode = {
  conference: 'conference',
  hackathon: 'hackathon',
  contest: 'contest',
  bootcamp: 'bootcamp',
  others: 'others',
} as const;

// 공모전 온오프라인 구분
export const EventOnOffLineCode = {
  on: 'on',
  off: 'off',
  onOff: 'onOff',
} as const;

// 캠페인 광고유형(conversion 전환형, view 노출형)
export const CampaignConversionCode = {
  conversion: '전환형',
  view: '노출형',
} as const;

// 광고 상태
export const AdStatusCode = {
  before: '진행전',
  active: '진행중',
  close: '종료',
} as const;

// 광고유형
export const AdTypeCode = {
  banner: '메인 배너',
  event: '공모전',
  eventBanner: '공모전 배너',
  modalBanner: '모달 상세 배너',
  postBlock: '모집 블럭',
} as const;

export type AdType = keyof typeof AdTypeCode;

// 링크 오픈 유형
export const linkOpenCode = {
  blank: '새탭',
  self: '현재탭',
} as const;

// 로그 유형
export const AdLogCode = {
  impression: '노출',
  reach: '도달',
} as const;

// 사용자 상태
export const userStatusCode = {
  pjt_bld: '사이드 프로젝트 팀빌딩 중이에요',
  pjt_fnd: '사이드 프로젝트를 찾고있어요',
  sty_fnd: '스터디 그룹을 찾고 있어요',
  sty_bld: '스터디 팀원을 찾고 있어요',
  sta_crt: '창업을 준비중이에요',
  sta_bld: '초기 멤버를 찾고 있어요',
  evt_bld: '공모전에 함께 참여할 팀원을 구해요',
  evt_fnd: '참여할 공모전을 찾고 있어요',
} as const;

export const userSkillCode = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  vue: 'Vue',
  svelte: 'Svelte',
  nextjs: 'Nextjs',
  nodejs: 'Nodejs',
  java: 'Java',
  spring: 'Spring',
  go: 'Go',
  nestjs: 'Nestjs',
  kotlin: 'Kotlin',
  express: 'Express',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  python: 'Python',
  django: 'Django',
  php: 'PHP',
  graphql: 'GraphQL',
  firebase: 'Firebase',
  flutter: 'Flutter',
  swift: 'Swift',
  reactnative: 'ReactNative',
  unity: 'Unity',
  aws: 'AWS',
  kubernetes: 'Kubernetes',
  git: 'Git',
  figma: 'Figma',
  docker: 'Docker',
  zeplin: 'Zeplin',
  jest: 'Jest',
  c: 'C',
  pm: '일반 기획',
  svcpm: '서비스 기획',
  vuspm: '사업개발',
  mgtpm: '프로덕트 관리',
  dtapm: '데이터 분석',
  uide: 'UI 디자인',
  uxde: 'UX 디자인',
  webde: '웹 디자인',
  grhde: '그래픽 디자인',
  brdde: '브랜드 디자인',
  prtde: '제품 디자인',
  photoshop: 'Photoshop',
  illustrator: 'Illustrator',
  XD: 'XD',
  sketch: 'Sketch',
  protopie: 'ProtoPie',
  de3d: '3D',
  brdmk: '브랜드 마케팅',
  grsmk: '그로스 마케팅',
  cotmk: '콘텐츠 마케팅',
  pepmk: '퍼포먼스 마케팅',
  prmk: 'PR',
  appmk: '앱 마케팅',
  prmtmk: '프로모션 마케팅',
  alemk: '제휴 마케팅',
  campmk: '캠페인 마케팅',
} as const;

export type AdLogType = keyof typeof AdLogCode;

export const UserPositionCode = {
  FE: '프론트엔드',
  BE: '백엔드',
  DE: '디자이너',
  IOS: 'IOS',
  AND: '안드로이드',
  DEVOPS: '데브옵스',
  PM: 'PM',
  PD: '기획자',
  MK: '마케터',
} as const;
