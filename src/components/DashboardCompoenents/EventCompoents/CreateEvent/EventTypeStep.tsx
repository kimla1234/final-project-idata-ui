export default function EventTypeStep({ 
  onNext, 
  setFormData 
}: { 
  onNext: () => void; 
  setFormData: (data: any) => void 
}) {
  // Mapping names to the category_id your backend expects (e.g., Category 3)
  const types = [
    { id: 4, name: "CONFERENCE" },
    { id: 3, name: "WORKSHOP" },
    { id: 1, name: "CONCERT" },
    { id: 2, name: "SPORT" },
  ];

  const handleSelect = (id: number) => {
    setFormData({ category_id: id }); // Update the global state
    onNext(); // Move to Basic Info
  };

  return (
    <div className="space-y-6 mb-10">
      <h2 className="text-xl font-bold text-slate-800">
        What kind of event are you hosting?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {types.map((t) => (
          <div
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className="cursor-pointer rounded-xl border bg-white p-6 transition-all hover:border-blue-500 hover:shadow-md group"
          >
            <div className="text-lg font-bold group-hover:text-blue-600 transition-colors">
              {t.name}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Setup professional details for your {t.name.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}