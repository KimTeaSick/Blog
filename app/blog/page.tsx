import { BlogPosts } from 'app/components/posts'
import { PageHero } from 'app/components/page-hero'

export const revalidate = 60

export const metadata = {
  title: 'Blog',
  description: '개발 과정에서 배운 것과 선택의 근거를 기록합니다.',
}
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Engineering blog"
        title="만들면서 남긴 기록"
        description="실시간 미디어와 프론트엔드, 그리고 요즘의 AI 도구들. 결론만이 아니라 그 앞에서 고민하고 시도한 과정까지 함께 적어둡니다."
      />
      <BlogPosts variant="archive" />
    </>
  )
}
