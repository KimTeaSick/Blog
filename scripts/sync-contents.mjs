/**
 * blog-contents 저장소의 최신 main 을 내려받아 contents/ 에 채운다.
 *
 * 왜 필요한가:
 *   contents/ 는 git 서브모듈이라 "커밋 SHA"를 고정한다. blog-contents 에 글을
 *   올려도 이 SHA 는 그대로이므로, Vercel 이 재배포해도 옛 콘텐츠로 다시 빌드된다.
 *   이 스크립트가 빌드마다 최신 main 을 받아오면 blog-contents 에 push 하는 것만으로
 *   배포된 블로그가 갱신된다.
 *
 * 언제 실행되나:
 *   postinstall (--soft) 과 build 명령 앞, 두 곳에서 실행한다. Vercel 이 빌드
 *   명령으로 `npm run build` 를 쓰는지 `next build` 를 직접 쓰는지에 따라 npm
 *   라이프사이클을 건너뛸 수 있어서, 어느 경로로 들어와도 걸리도록 이중으로 건다.
 *   두 번 실행돼도 결과는 같다(멱등).
 *
 * --soft: 실패해도 exit 0. 단 이미 유효한 contents/ 가 있고, CI 가 아닐 때만.
 *         오프라인에서 로컬 npm install 이 깨지지 않게 하기 위한 것이다.
 *         CI/Vercel 에서는 --soft 를 무시하고 항상 중단한다. 옛 글이 조용히
 *         배포되는 것이 이 스크립트가 막으려는 바로 그 문제이기 때문이다.
 *
 * 건너뛰기: SKIP_CONTENTS_SYNC=1
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const REPO = process.env.CONTENTS_REPO ?? 'KimTeaSick/blog-contents'
const REF = process.env.CONTENTS_REF ?? 'main'
const ROOT = process.cwd()
const TARGET = path.join(ROOT, 'contents')

// 임시 폴더를 프로젝트 안에 둔다. os.tmpdir() 는 리눅스에서 별도 마운트일 수
// 있어 rename 이 EXDEV 로 실패한다.
const WORK = path.join(ROOT, '.contents-sync-tmp')

// 내려받은 아카이브가 실제로 콘텐츠 저장소인지 확인하는 데 쓴다.
const REQUIRED_PATHS = ['blog/posts']

// CI/Vercel 에서는 --soft 를 무시한다. 조용한 스테일 배포를 막는 것이 목적이므로.
const IS_CI = Boolean(process.env.CI || process.env.VERCEL)
const SOFT = process.argv.includes('--soft') && !IS_CI

const log = (msg) => console.log(`[sync-contents] ${msg}`)
const warn = (msg) => console.warn(`[sync-contents] ${msg}`)

/** contents/ 가 이미 쓸 만한 상태인지 */
function targetLooksValid() {
  return REQUIRED_PATHS.every((p) => fs.existsSync(path.join(TARGET, p)))
}

function fail(msg) {
  // process.exit() 은 finally 를 건너뛰므로 여기서 직접 치운다.
  fs.rmSync(WORK, { recursive: true, force: true })

  if (SOFT && targetLooksValid()) {
    warn(`${msg}`)
    warn('--soft 모드이고 기존 contents/ 가 유효하므로 그대로 두고 넘어갑니다.')
    warn('빌드 시에는 다시 시도하며, 그때 실패하면 빌드를 중단합니다.')
    process.exit(0)
  }
  console.error(`[sync-contents] ${msg}`)
  console.error('[sync-contents] 옛 콘텐츠로 배포되는 것을 막기 위해 중단합니다.')
  console.error('[sync-contents] 건너뛰려면 SKIP_CONTENTS_SYNC=1 을 설정하세요.')
  process.exit(1)
}

/** 같은 파일시스템이면 rename, 아니면 복사로 대체 */
function move(from, to) {
  try {
    fs.renameSync(from, to)
  } catch (err) {
    if (err?.code !== 'EXDEV') throw err
    fs.cpSync(from, to, { recursive: true })
    fs.rmSync(from, { recursive: true, force: true })
  }
}

if (process.env.SKIP_CONTENTS_SYNC === '1') {
  log('SKIP_CONTENTS_SYNC=1 — 동기화를 건너뜁니다.')
  process.exit(0)
}

const tarballUrl = `https://codeload.github.com/${REPO}/tar.gz/refs/heads/${REF}`
const tarballPath = path.join(WORK, 'contents.tar.gz')
const extractDir = path.join(WORK, 'extracted')
const oldDir = path.join(WORK, 'old')

try {
  fs.rmSync(WORK, { recursive: true, force: true })
  fs.mkdirSync(extractDir, { recursive: true })

  log(`${REPO}@${REF} 내려받는 중...`)

  let res
  try {
    res = await fetch(tarballUrl, {
      headers: { 'user-agent': 'blog-build' },
      redirect: 'follow',
    })
  } catch (err) {
    fail(`네트워크 오류: ${err instanceof Error ? err.message : String(err)}`)
  }

  if (!res.ok) {
    fail(`다운로드 실패: HTTP ${res.status} ${res.statusText} (${tarballUrl})`)
  }

  fs.writeFileSync(tarballPath, Buffer.from(await res.arrayBuffer()))

  // GitHub tarball 은 'blog-contents-<sha>/' 한 겹으로 감싸여 있어 벗겨낸다.
  execFileSync('tar', ['-xzf', tarballPath, '-C', extractDir, '--strip-components=1'], {
    stdio: 'inherit',
  })

  for (const required of REQUIRED_PATHS) {
    if (!fs.existsSync(path.join(extractDir, required))) {
      fail(`받은 아카이브에 ${required} 가 없습니다. 저장소나 브랜치를 확인하세요.`)
    }
  }

  // 여기부터 교체. 새 디렉터리를 확보한 뒤에 기존 것을 치우므로,
  // 중간에 실패해도 contents/ 가 사라진 채 남지 않는다.
  const hadTarget = fs.existsSync(TARGET)
  if (hadTarget) {
    move(TARGET, oldDir)
  }

  try {
    move(extractDir, TARGET)
  } catch (err) {
    // 교체에 실패하면 원래 것을 되돌려 놓는다.
    if (hadTarget && !fs.existsSync(TARGET)) {
      move(oldDir, TARGET)
    }
    throw err
  }

  // 서브모듈 링크(.git)는 살려둔다. 지우면 로컬에서 서브모듈이 깨진다.
  const oldGitLink = path.join(oldDir, '.git')
  if (hadTarget && fs.existsSync(oldGitLink)) {
    move(oldGitLink, path.join(TARGET, '.git'))
  }

  const postsDir = path.join(TARGET, 'blog', 'posts')
  const posts = fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() || entry.name.endsWith('.mdx'))
    .map((entry) => entry.name)

  log(`완료 — 글 ${posts.length}개: ${posts.join(', ')}`)
} catch (err) {
  fail(err instanceof Error ? err.message : String(err))
} finally {
  fs.rmSync(WORK, { recursive: true, force: true })
}
