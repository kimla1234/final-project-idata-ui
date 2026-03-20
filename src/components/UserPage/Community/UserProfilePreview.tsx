import Image from "next/image";


// បង្កើត Component តូចមួយសម្រាប់បង្ហាញ Profile
export const UserProfilePreview = ({ api }: { api: any }) => {
  return (
    <div className="w-[320px] overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      {/* 🎯 ប្លង់រូបភាព Cover តូចៗ ៣សន្លឹក ដូច Behance */}
      <div className="grid h-24 grid-cols-3 gap-1 p-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative overflow-hidden bg-gray-100 first:rounded-l-2xl last:rounded-r-2xl">
            <img 
              src={`https://picsum.photos/seed/${api.ownerId + i}/200`} 
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
              alt="work preview"
            />
          </div>
        ))}
      </div>

      <div className="relative -mt-10 flex flex-col items-center px-5 pb-6 pt-2">
        {/* Avatar ជាមួយ Border ក្រាស់ស្អាត */}
        <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
          <Image
            unoptimized
            src={api.ownerAvatar || "https://ui-avatars.com/api/?name=" + api.ownerName}
            width={80}
            height={80}
            alt={api.ownerName}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="mt-3 text-lg font-black text-gray-900 leading-tight">{api.ownerName}</h3>
        <p className="text-[11px] font-bold text-blue-600">
          {api.ownerHandle || "@" + api.ownerName.toLowerCase().replace(/\s+/g, '')}
        </p>

        {/* 🎯 Stats Section */}
        <div className="mt-5 grid w-full grid-cols-3 border-y border-gray-50 py-4">
          <div className="text-center">
            <div className="text-sm font-black text-gray-900">0</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Likes</div>
          </div>
          <div className="border-x border-gray-50 text-center">
            <div className="text-sm font-black text-gray-900">0</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-black text-gray-900">{api.viewCount || 0}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Views</div>
          </div>
        </div>

        <div className="mt-5 flex w-full gap-2">
          <button className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95">
            + Follow
          </button>
          <button className="flex-1 rounded-xl border border-gray-100 bg-gray-50 py-2.5 text-xs font-bold text-gray-700 transition-all hover:bg-gray-100 active:scale-95">
            Message
          </button>
        </div>
      </div>
    </div>
  );
};