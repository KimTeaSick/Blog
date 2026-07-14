import Link from "next/link";
import { BlogPosts } from "app/components/posts";
import { PortfolioList } from "app/components/portfolio-list";

// ISR: 60초마다 자동으로 재검증
export const revalidate = 60

export default function Page() {
  return (
    <section>
      <div className="mb-12">
        <p className="rise rise-1 font-geist-mono mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Frontend Developer
        </p>
        <h1 className="rise rise-1 text-5xl font-semibold tracking-tighter">
          <span className="text-gradient">Joseph Kim</span>
        </h1>
      </div>

      <div className="mb-12 space-y-6">
        <div className="space-y-4">
          <p className="rise rise-2 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
            프론트엔드 개발자로써{" "}
            <span className="marker font-medium text-neutral-900 dark:text-neutral-100">
              "사용자가 이 버튼 꼭 누르게 하고 싶다"
            </span>
            는 집념으로 인터랙션을 만들어왔습니다.
          </p>

          <p className="rise rise-3 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
            특수 학급용 AIDT 서비스도 직접 설계·개발해서, 지금은{" "}
            <span className="marker font-medium text-neutral-900 dark:text-neutral-100">
              국가특수교육원에서 실제로 쓰이고 있어
            </span>{" "}
            괜히 어깨가 올라갑니다.
          </p>
        </div>

        <div className="rise rise-3 border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 py-2">
          <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            기술은 멋있어 보여도, 결국{" "}
            <span className="italic">"사람들이 편하게 쓸 수 있냐"</span>가 제
            기준이라 늘 구조부터 차근차근 정리하는 편입니다.
          </p>
        </div>

        <p className="rise rise-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
          결론은… 잘 보이고, 잘 눌리고, 잘쓰이는 서비스 만드는 일을 누구보다
          즐깁니다.
        </p>
      </div>

      {/* Portfolio Section */}
      <div className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Projects
          </h2>
          <Link
            href="/portfolio"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            View all →
          </Link>
        </div>
        <PortfolioList limit={3} />
      </div>

      {/* Blog Section */}
      <div className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Recent Posts</h2>
          <Link
            href="/blog"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            View all →
          </Link>
        </div>
        <BlogPosts limit={4} variant="grid" />
      </div>
    </section>
  );
}
