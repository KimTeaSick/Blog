import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index} className="border border-neutral-200 dark:border-neutral-700 px-4 py-2 bg-neutral-50 dark:bg-neutral-800 text-left">{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index} className="border-b border-neutral-200 dark:border-neutral-700">
      {row.map((cell, cellIndex) => (
        <td key={cellIndex} className="border border-neutral-200 dark:border-neutral-700 px-4 py-2">{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table className="w-full border-collapse border border-neutral-200 dark:border-neutral-700 my-6">
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function createRoundedImage(slug?: string, type?: string) {
  return function RoundedImage(props) {
    let src = props.src

    // Convert relative paths to API route
    if (slug && src && !src.startsWith('http') && !src.startsWith('/')) {
      if (type === 'portfolio') {
        src = `/api/portfolio-image/${slug}/${src}`
      } else {
        src = `/api/blog-image/${slug}/${src}`
      }
    }

    // If no width/height provided, use unoptimized img tag
    if (!props.width || !props.height) {
      return (
        <img
          alt={props.alt}
          className="rounded-lg"
          {...props}
          src={src}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )
    }

    return <Image alt={props.alt} className="rounded-lg" {...props} src={src} />
  }
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

export function CustomMDX(props) {
  const { slug, type, ...rest } = props

  const components = {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    Image: createRoundedImage(slug, type),
    img: createRoundedImage(slug, type),
    a: CustomLink,
    code: Code,
    Table,
  }

  return (
    <MDXRemote
      {...rest}
      components={{ ...components, ...(props.components || {}) }}
      // 콘텐츠는 본인 소유 submodule(신뢰됨)이라 style={{}} 등 정상 JSX 표현식을 허용.
      // blockDangerousJS 는 기본 true 로 유지되어 eval/Function/require 등 RCE 는 계속 차단.
      options={{ blockJS: false }}
    />
  )
}
