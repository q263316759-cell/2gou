'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { useState } from 'react'
import { useBlogIndex } from '@/hooks/use-blog-index'

export default function Page() {
  const { siteContent } = useConfigStore()
  const { items: articles, loading } = useBlogIndex()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  
  // 筛选出分类为"游戏"的文章
  const gamesArticles = articles.filter(item => item.category === '游戏')
  
  // 获取所有标签
  const allTags = Array.from(new Set(gamesArticles.flatMap(article => article.tags || [])))
  
  // 根据搜索词和标签筛选文章
  const filteredArticles = gamesArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTag = selectedTag === 'all' || (article.tags && article.tags.includes(selectedTag))
    return matchesSearch && matchesTag
  })
  
  console.log('Total articles:', articles.length)
  console.log('gamesArticles length:', gamesArticles.length)
  console.log('filteredArticles length:', filteredArticles.length)
  console.log('allTags:', allTags)

  // 截断文本函数
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className='mx-auto w-full max-w-[1920px] px-6 pt-24 pb-12'>
      <div className='mb-8 space-y-4'>
        <input
          type='text'
          placeholder='搜索游戏...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='focus:ring-brand mx-auto block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
        />

        <div className='flex flex-wrap justify-center gap-2'>
          <button
            onClick={() => setSelectedTag('all')}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              selectedTag === 'all' ? 'bg-brand text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
              全部
            </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                selectedTag === tag ? 'bg-brand text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}>
                {tag}
              </button>
            ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '1920px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {filteredArticles.map((article, index) => (
            <motion.div 
              key={article.slug} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.3 }}
              style={{ 
                width: '300px', 
                height: '450px', // 2:3 比例
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(4px)',
                flexShrink: 0,
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '100%' }}>
                <Link href={`/blog/${article.slug}`} style={{ display: 'block', height: 'calc(100% - 30px)', padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {article.cover && (
                      <div style={{ width: '100%', flex: 1, borderRadius: '0.5rem', marginBottom: '16px', overflow: 'hidden', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <Image
                          src={article.cover}
                          alt={article.title}
                          width={300}
                          height={300}
                          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                        />
                      </div>
                    )}
                    <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#000', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#000'}>
                      {article.title}
                    </h2>
                  </div>
                </Link>
                <div style={{ padding: '0 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {article.tags && article.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {article.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} style={{ fontSize: '0.7rem', color: '#6b7280', backgroundColor: 'rgba(107, 114, 128, 0.1)', padding: '2px 8px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => setSelectedTag(tag)} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}>
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {new Date(article.date).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className='mt-12 text-center text-gray-500'>
            <p>没有找到相关游戏</p>
          </div>
        )}
      </div>
    </div>
  )
}
