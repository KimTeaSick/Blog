/**
 * 빌드 직전에 blog-contents 저장소의 최신 main을 내려받아 contents/ 에 채운다.
 *
 * 왜 필요한가:
 *   contents/ 는 git 서브모듈이라 "커밋 SHA"를 고정한다. blog-contents 에 글을
 *   올려도 이 SHA 는 그대로이므로, Vercel 이 재배포해도 옛 콘텐츠로 다시 빌드된다.
 *   이 스크립트가 빌드마다 최신 main 을 받아오면 blog-contents 에 push 하는 것만으로
 *   배포된 블로그가 갱신된다.
 *
 * git 명령에 의존하지 않고 HTTPS tarball 을 받는다. 빌드 환경마다 git 이나
 * 서브모듈 자격증명 상태가 달라도 동일하게 동작시키기 위해서다.
 *
 * 건너뛰려면: SKIP_CONTENTS_SYNC=1 npm run build
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const REPO = process.env.CONTENTS_REPO ?? 'KimTeaSick/blog-contents'
const REF = process.env.CONTENTS_REF ?? 'main'
const TARGET = path.join(process.cwd(), 'contents')

// 내려받은 tarball 이 실제로 콘텐츠 저장소인지 확인하는 데 쓴다.
// 이 경로들이 없으면 잘못된 것을 받은 것이므로 빌드를 멈춘다.
const REQUIRED_PATHS = ['blog/posts']

const log = (msg) => console.log(`[sync-contents] ${msg}`)

function fail(msg) {
  console.error(`[sync-contents] ${msg}`)
  console.error('[sync-contents] 스테일 콘텐츠로 배포되는 것을 막기 위해 빌드를 중단합니다.')
  console.error('[sync-contents] 동기화를 건너뛰려면 SKIP_CONTENTS_SYNC=1 을 설정하세요.')
  process.exit(1)
}

if (process.env.SKIP_CONTENTS_SYNC === '1') {
  log('SKIP_CONTENTS_SYNC=1 — 동기화를 건너뜁니다.')
  process.exit(0)
}

const tarballUrl = `https://codeload.github.com/${REPO}/tar.gz/refs/heads/${REF}`
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'contents-sync-'))
const tarballPath = path.join(workDir, 'contents.tar.gz')
const extractDir = path.join(workDir, 'extracted')

try {
  log(`${REPO}@${REF} 내려받는 중...`)

  const res = await fetch(tarballUrl, {
    headers: { 'user-agent': 'blog-build' },
    redirect: 'follow',
  })

  if (!res.ok) {
    fail(`다운로드 실패: HTTP ${res.status} ${res.statusText} (${tarballUrl})`)
  }

  fs.writeFileSync(tarballPath, Buffer.from(await res.arrayBuffer()))
  fs.mkdirSync(extractDir, { recursive: true })

  // GitHub tarball 은 'blog-contents-<sha>/' 한 겹으로 감싸여 있어 벗겨낸다.
  execFileSync('tar', ['-xzf', tarballPath, '-C', extractDir, '--strip-components=1'], {
    stdio: 'inherit',
  })

  for (const required of REQUIRED_PATHS) {
    if (!fs.existsSync(path.join(extractDir, required))) {
      fail(`받은 아카이브에 ${required} 가 없습니다. 저장소나 브랜치를 확인하세요.`)
    }
  }

  // 서브모듈 링크(.git 파일)는 살려둔다. 지우면 로컬에서 서브모듈이 깨진다.
  const gitLink = path.join(TARGET, '.git')
  const gitLinkBackup = path.join(workDir, 'git-link-backup')
  const hasGitLink = fs.existsSync(gitLink)

  if (hasGitLink) {
    fs.renameSync(gitLink, gitLinkBackup)
  }

  // 삭제된 글이 남지 않도록 통째로 갈아끼운다.
  fs.rmSync(TARGET, { recursive: true, force: true })
  fs.renameSync(extractDir, TARGET)

  if (hasGitLink) {
    fs.renameSync(gitLinkBackup, gitLink)
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
  fs.rmSync(workDir, { recursive: true, force: true })
}
