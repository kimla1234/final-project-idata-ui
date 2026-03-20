import JoinWorkspacePage from '@/components/DashboardCompoenents/Layouts/header/JoinWorkspacePage'
import React from 'react'

// 🎯 កែជា async function និង params ជា Promise
export default async function page({ params }: { params: Promise<{ id: string }> }) {
  
  // 🎯 ចាំបាច់ត្រូវ await params សិន ទើបអាចយក id ចេញមកបាន
  const resolvedParams = await params;

  return (
    <div>
      {/* បោះ params ដែលដោះចេញរួច (Resolved) ទៅឱ្យ JoinWorkspacePage */}
      <JoinWorkspacePage params={resolvedParams} />
    </div>
  )
}