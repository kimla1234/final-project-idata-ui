import React from 'react'

export default function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
    <div className="rounded-[10px] border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
      <div className="overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F7F9FC] dark:bg-dark-2">
              <th className="py-4 pl-7.5 text-left">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </th>
              <th className="px-4 py-4 text-left">
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
              </th>
              <th className="px-4 py-4 text-left">
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
              </th>
              <th className="px-4 py-4 text-left">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              </th>
              <th className="py-4 pr-7.5 text-right">
                <div className="ml-auto h-4 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, index) => (
              <tr
                key={index}
                className="border-b border-[#eee] dark:border-dark-3"
              >
                <td className="py-4 pl-7.5">
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-20 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td className="py-4 pr-7.5 text-right">
                  <div className="ml-auto h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="flex items-center justify-end gap-6">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-9 rounded-md bg-gray-200 dark:bg-gray-700"
          ></div>
        ))}
      </div>
    </div>
  </div>
  )
}
