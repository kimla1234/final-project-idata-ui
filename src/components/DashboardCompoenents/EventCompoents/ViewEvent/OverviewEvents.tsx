"use client";
import { EventData } from "@/redux/service/events";
import {
  Calendar,
  Clock,
  ImageIcon,
  MapPin,
  Save,
  X,
  UploadCloud,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

import { useToast } from "@/hooks/use-toast";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditEventMutation } from "@/redux/service/organizer";
import { usePostImageMutation } from "@/redux/service/user";
import RichTextEditor from "../../ui/RichTextEditor";

interface OverviewEventsProps {
  eventData: EventData;
}

export default function OverviewEvents({ eventData }: OverviewEventsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Mutations
  const [editEvent, { isLoading: isUpdating }] = useEditEventMutation();
  const [postImage, { isLoading: isUploadingImage }] = usePostImageMutation();

  // Local state for Modal
  const [formData, setFormData] = useState({
    title: eventData.title,
    description: eventData.description || "",
    status: eventData.status ?? true,
    start_date: eventData.start_date || "",
    end_date: eventData.end_date || "",
    location_name: eventData.location_name || "",
    latitude: eventData.latitude || "",
    longitude: eventData.longitude || "",
    image: eventData.image || "",
    imagesEvent: eventData.imagesEvent?.[0] || "",
  });

  useEffect(() => {
    setFormData({
      title: eventData.title,
      description: eventData.description || "",
      status: eventData.status ?? true,
      start_date: eventData.start_date?.split(".")[0] || "",
      end_date: eventData.end_date?.split(".")[0] || "",
      location_name: eventData.location_name || "",
      latitude: eventData.latitude || "",
      longitude: eventData.longitude || "",
      image: eventData.image || "",
      imagesEvent: eventData.imagesEvent?.[0] || "",
    });
  }, [eventData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Logic: Uploads image immediately to media service
   * and updates local formData with the returned URL
   */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "imagesEvent",
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // ១. បង្កើត FormData ហើយ append ឯកសារចូលដោយប្រើ key "file"
    const fileData = new FormData();
    fileData.append("file", selectedFile);

    try {
      // ២. បញ្ជូន fileData (FormData) ទៅកាន់ postImage ផ្ទាល់
      // ប្រសិនបើ TS error ត្រង់ postImage សូមប្រើ (fileData as any)
      const uploadRes = await postImage(fileData as any).unwrap();

      // ៣. ទាញយក "uri" ពី Response format (ដូចដែលយើងបានពិនិត្យពីមុន)
      const imageUri = (uploadRes as any)?.uri;

      if (!imageUri) throw new Error("Upload failed to return URL");

      // ៤. រក្សាទុក URL ចូលក្នុង Local State
      setFormData((prev) => ({
        ...prev,
        [field]: imageUri,
      }));

      toast({
        title: "ជោគជ័យ!",
        description: "រូបភាពត្រូវបានបញ្ចូលរួចរាល់",
        variant: "default",
      });
    } catch (err) {
      console.error("Upload Error Detail:", err); // បន្ថែមនេះដើម្បីមើលមូលហេតុក្នុង Console
      toast({
        title: "មានបញ្ហា!",
        description: "មិនអាចបញ្ចូលរូបភាពបានទេ",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      await editEvent({
        uuid: eventData.uuid,
        body: {
          ...eventData,
          ...formData,
          imagesEvent: formData.imagesEvent ? [formData.imagesEvent] : [],
        },
      }).unwrap();

      toast({
        title: "Update Successfully 🎉",
        variant: "success",
        duration: 2000,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        variant: "destructive",
      });
    }
  };

  // Helper formatting
  const formatDate = (dateStr: string) =>
    !dateStr
      ? "N/A"
      : new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  const formatTime = (dateStr: string) =>
    !dateStr
      ? "N/A"
      : new Date(dateStr).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <div className="col-span-2 mx-auto w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Event Details</h1>
        <div className="flex items-center space-x-3">
          <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            ID: {eventData.id}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-purple-200 bg-purple-50 text-purple-700 shadow-sm transition-all hover:bg-purple-100 active:scale-95"
              >
                <FiEdit className="h-4 w-4" />
                <span className="font-medium">Edit Event Details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[100vh] overflow-hidden rounded-lg bg-white p-3 sm:max-w-[700px]">
              <DialogHeader className="p-4 pb-2">
                <DialogTitle className="text-xl font-bold">
                  Update Event Info
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[65vh] px-6 py-2">
                <div className="grid gap-6 pb-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Event Name
                      </label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="bg-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Description
                      </label>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(val) =>
                          setFormData({ ...formData, description: val })
                        }
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Start Date
                      </label>
                      <Input
                        type="datetime-local"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="bg-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">End Date</label>
                      <Input
                        type="datetime-local"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="bg-slate-100"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4 rounded-lg border bg-gray-50/50 p-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Location Name
                      </label>
                      <Input
                        name="location_name"
                        value={formData.location_name}
                        onChange={handleInputChange}
                        className="bg-slate-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Latitude</label>
                        <Input
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="bg-slate-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Longitude</label>
                        <Input
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="bg-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Uploads */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Thumbnail", key: "image" as const },
                      { label: "Main Image", key: "imagesEvent" as const },
                    ].map((img) => (
                      <div key={img.key} className="space-y-2">
                        <label className="text-sm font-semibold">
                          {img.label}
                        </label>
                        <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-gray-50">
                          {formData[img.key] ? (
                            <img
                              src={formData[img.key]}
                              className="h-full w-full object-cover"
                              alt="Preview"
                            />
                          ) : (
                            <UploadCloud className="text-gray-400" />
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 cursor-pointer opacity-0"
                            onChange={(e) => handleFileChange(e, img.key)}
                          />
                          {isUploadingImage && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                              <Loader2 className="animate-spin text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="gap-2 border-t p-4">
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleSave}
                  disabled={isUpdating || isUploadingImage}
                  className="bg-primary px-8"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* --- OLD UI PRESERVED --- */}
      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-500">
            Event Name
          </label>
          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-gray-800">
            {eventData.title}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-500">
            Description
          </label>
          <div
            className="prose prose-lg min-h-[100px] w-full max-w-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 leading-relaxed text-gray-700 [&_ol]:my-0.5 [&_p]:my-0.5 [&_ul]:my-0.5"
            dangerouslySetInnerHTML={{
              __html: eventData.description || "No description provided.",
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <label className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Calendar size={14} /> Event Date
            </label>
            <p className="font-medium text-gray-800">
              {formatDate(eventData.start_date)}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <label className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Clock size={14} /> Start Time
            </label>
            <p className="font-medium text-gray-800">
              {formatTime(eventData.start_date)}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <label className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Clock size={14} /> End Time
            </label>
            <p className="font-medium text-gray-800">
              {formatTime(eventData.end_date)}
            </p>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-500">
            Location & Map
          </label>
          <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            {eventData.latitude && eventData.longitude ? (
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${eventData.latitude},${eventData.longitude}&z=15&output=embed`}
              ></iframe>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <MapPin className="mx-auto mb-2 text-purple-400" size={32} />
                <span className="text-sm font-medium text-gray-600">
                  {eventData.location_name}
                </span>
              </div>
            )}
          </div>
          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700">
            {eventData.location_name}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-500">
              Thumbnail
            </label>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {eventData.image ? (
                <img
                  src={eventData.image}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="text-gray-300" size={40} />
              )}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-500">
              Main Image
            </label>
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {eventData.imagesEvent?.[0] ? (
                <img
                  src={eventData.imagesEvent[0]}
                  alt="Event cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="text-gray-300" size={40} />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-100 pt-6">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="bg-gray-800 px-8 text-white hover:bg-gray-900"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
