'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useWriteStore } from '../../stores/write-store'

type DownloadSectionProps = {
	delay?: number
}

// 内置网盘名称选项
const cloudStorageOptions = [
	{ value: '百度网盘', label: '百度网盘' },
	{ value: '阿里云盘', label: '阿里云盘' },
	{ value: '蓝奏', label: '蓝奏云' },
	{ value: '夸克', label: '夸克网盘' },
	{ value: '迅雷', label: '迅雷网盘' },
	{ value: '豆包', label: '豆包网盘' },
	{ value: 'GitHub', label: 'GitHub下载' },
	{ value: '本地下载', label: '本地下载' }
]

export function DownloadSection({ delay = 0 }: DownloadSectionProps) {
	const { form, addDownloadLink, deleteDownloadLink } = useWriteStore()
	const [selectedCloudStorage, setSelectedCloudStorage] = useState('')
	const [inputUrl, setInputUrl] = useState('')

	const handleAddDownloadLink = () => {
		if (inputUrl.trim() && selectedCloudStorage) {
			addDownloadLink({
				name: selectedCloudStorage,
				url: inputUrl.trim()
			})
			setSelectedCloudStorage('')
			setInputUrl('')
		}
	}

	// 即使没有下载链接，也显示容器以便用户添加

	return (
		<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} className='card relative'>
			<div className='flex items-center justify-between'>
				<h2 className='text-sm'>云盘下载</h2>
				<button
					className='rounded-lg border bg-white/70 px-3 py-1 text-xs whitespace-nowrap'
					onClick={handleAddDownloadLink}
				>
					添加
				</button>
			</div>
			<div className='mt-3 flex flex-col gap-2'>
				<div className='flex flex-wrap items-center gap-2'>
					<select
						className='bg-card flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-sm'
						value={selectedCloudStorage}
						onChange={(e) => setSelectedCloudStorage(e.target.value)}
					>
						<option value=''>选择网盘名称</option>
						{cloudStorageOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<input
						placeholder='https://...'
						className='bg-card flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-sm'
						type='text'
						value={inputUrl}
						onChange={(e) => setInputUrl(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleAddDownloadLink()}
					/>
				</div>
				<div className='mt-2 grid grid-cols-1 gap-2'>
					{form.downloadLinks && form.downloadLinks.length > 0 ? (
						form.downloadLinks.map((link, index) => (
							<div key={index} className='group bg-card hover:bg-secondary/20 flex items-center justify-between rounded-lg border p-2'>
								<div className='flex items-center gap-2 flex-1 min-w-0'>
									<span className='text-xs truncate whitespace-nowrap'>{link.name}</span>
									<span className='text-xs text-neutral-500 truncate flex-1'>{link.url}</span>
								</div>
								<button
									className='text-xs text-red-500 hover:text-red-700 whitespace-nowrap'
									onClick={() => deleteDownloadLink(index)}
								>
									删除
								</button>
							</div>
						))
					) : (
						<div className='bg-card rounded-lg border p-6 text-center'>
							<span className='text-sm text-neutral-400'>暂无下载链接</span>
							<p className='text-xs text-neutral-500 mt-1'>请在上方选择网盘名称和输入链接后点击添加</p>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	)
}
