export default function LoginSkeletonEventDetail() {
  return (
    <div className="min-h-screen bg-white pb-20 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-10">
        
        {/* Back Link */}
        <div className="h-5 w-40 bg-gray-200 rounded" />

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* LEFT */}
          <div className="w-full space-y-8 lg:w-[60%]">
            {/* Image */}
            <div className="h-[375px] w-full bg-gray-200 rounded-2xl relative" />

            {/* Event Info */}
            <div className="space-y-4 bg-gray-50 border rounded-xl p-6">
              <div className="h-7 w-3/4 bg-gray-300 rounded"></div> {/* Title */}
              
              <div className="flex gap-5">
                <div className="h-4 w-24 bg-gray-200 rounded"></div> {/* Date */}
                <div className="h-4 w-20 bg-gray-200 rounded"></div> {/* Time */}
              </div>

              <div className="h-4 w-1/2 bg-gray-200 rounded"></div> {/* Location */}
              <div className="h-24 w-full bg-gray-200 rounded"></div> {/* Description */}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24 w-full lg:w-[40%] h-fit bg-purple-50 p-4 border rounded-xl space-y-4">
            
            {/* Ticket Rows */}
            <div className="space-y-3">
              <div className="h-16 bg-white rounded-xl border w-full"></div>
              <div className="h-16 bg-white rounded-xl border w-full"></div>
              <div className="h-16 bg-white rounded-xl border w-full"></div>
            </div>

            {/* Subtotal & Button */}
            <div className="mt-8 border-t pt-6 space-y-3">
              <div className="h-5 w-24 bg-gray-300 rounded"></div> {/* Subtotal */}
              <div className="h-12 bg-gray-300 rounded-xl w-full"></div> {/* Place Order */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
