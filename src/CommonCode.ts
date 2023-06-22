// 프로젝트/스터디
export const PostTypeCode = {
  1: '1',
  2: '2',
} as const;

// 온/오프라인
export const PostOnlineOrOfflineCode = {
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
  n: 'n',
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

// URL Type
export const UserUrlType = {
  GitHub: 'GitHub',
  Notion: 'Notion',
  LinkedIn: 'LinkedIn',
  Instargram: 'Instargram',
  Brunch: 'Brunch',
  Youtube: 'Youtube',
  Blog: 'Blog',
  Link: 'Link',
  Twitter: 'Twitter',
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
