"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Maximize2,
  Move,
  Upload,
} from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import RichTextEditor from "../../ui/RichTextEditor";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { cn } from "@/lib/utils";
import { usePostImageMutation } from "@/redux/service/organizer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Formik, Form, Field as FormikField, ErrorMessage } from "formik";
import * as Yup from "yup";

export function BasicInfoStep({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [postImage, { isLoading: isUploading }] = usePostImageMutation();

  // 1. Create Refs
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  // Function សម្រាប់បកស្រាយ Link ដើម្បីយក Lat/Long
  const extractLatLng = (url: string) => {
    if (!url) return null;
    const pinMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (pinMatch) return { lat: pinMatch[1], lng: pinMatch[2] };
    const queryMatch = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (queryMatch) return { lat: queryMatch[1], lng: queryMatch[2] };
    const centerMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (centerMatch) return { lat: centerMatch[1], lng: centerMatch[2] };
    return null;
  };

  const [openDate, setOpenDate] = React.useState(false);
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Event name is required"),
    description: Yup.string().required("Description is required"),
    start_date: Yup.string().required("Start date is required"),
    end_date: Yup.string().required("End date is required"),
    start_time: Yup.string().required("Start time is required"),
    end_time: Yup.string().required("End time is required"),
    latitude: Yup.string().required("Latitude is required"),
    longitude: Yup.string().required("Longitude is required"),
    location_name: Yup.string().required("Location detail is required"),
    image: Yup.string().required("Event logo is required"),
    imagesEvent: Yup.array().min(1, "Main cover image is required"),
  });

  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        setFormData(values);
        onNext();
      }}
    >
      {({ values, setFieldValue, setFieldTouched, errors, touched }) => {
        // Sync parent state
        const handleChangeSync = (field: string, value: any) => {
          setFieldValue(field, value);
          setFormData({ ...values, [field]: value });
        };

        const handleFileUploadSync = async (
          e: React.ChangeEvent<HTMLInputElement>,
          field: "image" | "imagesEvent",
        ) => {
          const file = e.target.files?.[0];
          if (!file) return;
          // បន្ថែមបន្ទាត់នេះ៖ ប្រាប់ Formik ថា Field នេះត្រូវបានប៉ះហើយ
          setFieldTouched(field, true);
          const fileData = new FormData();
          fileData.append("file", file);
          try {
            const response = await postImage(fileData as any).unwrap();
            const imageUri = response?.uri;
            if (imageUri) {
              if (field === "imagesEvent") {
                setFieldValue("imagesEvent", [imageUri]);
                setFormData({ ...values, imagesEvent: [imageUri] });
              } else {
                setFieldValue(field, imageUri);
                setFormData({ ...values, [field]: imageUri });
              }
            }
          } catch (error) {
            alert("Upload failed");
          }
        };

        return (
          <Form className="space-y-6">
            <div className="space-y-6">
              {/* 3. HIDDEN INPUTS */}
              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                onChange={(e) => handleFileUploadSync(e, "image")}
              />

              <input
                type="file"
                ref={coverInputRef}
                className="hidden"
                onChange={(e) => handleFileUploadSync(e, "imagesEvent")}
              />

              <div className="space-y-6 rounded-xl border bg-white p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-bold">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={cn(
                        "w-full rounded-lg border border-slate-200 p-2.5 outline-none ring-blue-100 focus:ring-2",
                        errors.title && touched.title && "border-red-500",
                      )}
                      placeholder="e.g. Summer Music Fest 2026"
                      value={values.title}
                      onChange={(e) =>
                        handleChangeSync("title", e.target.value)
                      }
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col gap-3">
                    <label className="mb-1.5 block font-medium">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                      value={values.description}
                      onChange={(val) => handleChangeSync("description", val)}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>

                  <div className="col-span-1 flex flex-col gap-3">
                    <label className="px-1 text-sm font-bold">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between border-gray-3 font-normal",
                            errors.start_date &&
                              touched.start_date &&
                              "border-red-500",
                          )}
                        >
                          {values.start_date
                            ? new Date(values.start_date)
                                .toLocaleDateString()
                                .replace(/\//g, "-")
                            : "Select date"}
                          <HiOutlineCalendarDateRange />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden bg-gray-1 p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            values.start_date
                              ? new Date(values.start_date)
                              : undefined
                          }
                          onSelect={(date) => {
                            handleChangeSync("start_date", date?.toISOString());
                            setOpenDate(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <ErrorMessage
                      name="start_date"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Field className="w-32">
                      <FieldLabel htmlFor="start_time">
                        Start Time <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        type="time"
                        id="start_time"
                        name="start_time"
                        step="1"
                        value={values.start_time || "10:30:00"}
                        onChange={(e) =>
                          handleChangeSync("start_time", e.target.value)
                        }
                        className={cn(
                          "appearance-none bg-gray-2 [&::-webkit-calendar-picker-indicator]:hidden",
                          errors.start_time &&
                            touched.start_time &&
                            "border-red-500",
                        )}
                      />
                    </Field>

                    <Field className="w-32">
                      <FieldLabel htmlFor="end_time">
                        End Time <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        type="time"
                        id="end_time"
                        name="end_time"
                        step="1"
                        value={values.end_time || "10:30:00"}
                        onChange={(e) =>
                          handleChangeSync("end_time", e.target.value)
                        }
                        className={cn(
                          "appearance-none bg-gray-2 [&::-webkit-calendar-picker-indicator]:hidden",
                          errors.end_time &&
                            touched.end_time &&
                            "border-red-500",
                        )}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="px-1 text-sm font-bold">Start Date</label>
                    <Popover open={openStart} onOpenChange={setOpenStart}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between border-gray-3 font-normal"
                        >
                          {values.start_date
                            ? new Date(values.start_date)
                                .toLocaleDateString()
                                .replace(/\//g, "-")
                            : "Select date"}
                          <HiOutlineCalendarDateRange />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden bg-gray-1 p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            values.start_date
                              ? new Date(values.start_date)
                              : undefined
                          }
                          onSelect={(date) => {
                            handleChangeSync("start_date", date?.toISOString());
                            setOpenStart(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="px-1 text-sm font-bold">End Date</label>
                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between border-gray-3 font-normal",
                            errors.end_date &&
                              touched.end_date &&
                              "border-red-500",
                          )}
                        >
                          {values.end_date
                            ? new Date(values.end_date)
                                .toLocaleDateString()
                                .replace(/\//g, "-")
                            : "Select date"}
                          <HiOutlineCalendarDateRange />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden bg-gray-1 p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            values.end_date
                              ? new Date(values.end_date)
                              : undefined
                          }
                          onSelect={(date) => {
                            handleChangeSync("end_date", date?.toISOString());
                            setOpenEnd(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <ErrorMessage
                      name="end_date"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>

                <div className="mx-auto w-full max-w-4xl space-y-6 rounded-lg bg-white">
                  <div className="mx-auto w-full max-w-4xl space-y-6 rounded-lg bg-white pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[11px] text-sm font-bold uppercase tracking-wider text-slate-700">
                          Google Maps Link{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="latitude" // <--- បន្ថែម name ឱ្យដូចក្នុង Yup Schema
                            placeholder="Paste Google Maps URL here..."
                            onBlur={() => setFieldTouched("latitude", true)}
                            className={cn(
                              "w-full rounded-lg border border-slate-300 p-3 pr-10 outline-none transition-all focus:ring-2 focus:ring-blue-500",
                              errors.latitude &&
                                touched.latitude &&
                                "border-red-500",
                            )}
                            onChange={(e) => {
                              const url = e.target.value;
                              const coords = extractLatLng(url);

                              // ប្រាប់ Formik ថា field នេះត្រូវបានប៉ះហើយ
                              setFieldTouched("latitude", true);

                              if (coords) {
                                setFieldValue("latitude", coords.lat);
                                setFieldValue("longitude", coords.lng);
                                setFormData({
                                  ...values,
                                  latitude: coords.lat,
                                  longitude: coords.lng,
                                });
                              } else {
                                setFieldValue("latitude", ""); // បើលុប Link ចោល ត្រូវដាក់ឱ្យទទេ ដើម្បីឱ្យ Validation ដើរ
                                setFieldValue("longitude", "");
                              }
                            }}
                          />
                          <div className="absolute right-3 top-3">
                            {values.latitude ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <Maximize2 className="h-6 w-6 text-slate-300" />
                            )}
                          </div>
                        </div>

                        {/* Error Message នឹងលោតពេល Submit បើអត់មានតម្លៃ */}
                        <ErrorMessage
                          name="latitude"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />

                        <p className="text-[11px] italic text-slate-500">
                          * បើក Google Maps រួច Copy URL ពីលើ Browser មកដាក់
                        </p>
                      </div>

                      <div className="relative h-[400px] w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50 shadow-inner">
                        {values.latitude && values.longitude ? (
                          <iframe
                            key={`${values.latitude}-${values.longitude}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            src={`https://maps.google.com/maps?q=${values.latitude},${values.longitude}&hl=km&z=15&output=embed`}
                          ></iframe>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center text-slate-400">
                            <MapPin className="mb-2 h-8 w-8 opacity-20" />
                            <p className="text-sm italic">
                              សូមដាក់ Link ទីតាំងដើម្បី Preview ផែនទី
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Event Location detail
                    </label>
                    <input
                      type="text"
                      value={values.location_name || ""}
                      onChange={(e) =>
                        handleChangeSync("location_name", e.target.value)
                      }
                      placeholder="Enter Location Name (e.g. Aeon Mall Sen Sok)"
                      className={cn(
                        "w-full rounded-md border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500",
                        errors.location_name &&
                          touched.location_name &&
                          "border-red-500",
                      )}
                    />
                    <ErrorMessage
                      name="location_name"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="grid grid-cols-3 gap-4 border-t pt-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">
                      Event Logo
                    </label>
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className={cn(
                        "relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed transition-all hover:bg-slate-50",
                        values.image && !values.image.includes("tech")
                          ? "border-blue-500 bg-blue-50"
                          : errors.image && touched.image
                            ? "border-red-500"
                            : "border-slate-300",
                      )}
                    >
                      {values.image && !values.image.includes("tech") ? (
                        <>
                          <img
                            src={values.image}
                            className="absolute inset-0 h-full w-full object-cover opacity-50"
                            alt="Logo"
                          />
                          <div className="relative flex flex-col items-center text-blue-600">
                            <CheckCircle2 className="mb-1 h-6 w-6" />
                            <span className="text-[10px] font-bold uppercase">
                              Change
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="mb-1 h-6 w-6 text-slate-400" />
                          <span className="text-[10px] text-slate-400">
                            Upload Logo
                          </span>
                        </>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="text-[10px] text-red-500"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">
                      Main Cover
                    </label>
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className={cn(
                        "relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed transition-all hover:bg-slate-50",
                        values.imagesEvent?.[0]
                          ? "border-blue-500 bg-blue-50"
                          : errors.imagesEvent && touched.imagesEvent
                            ? "border-red-500"
                            : "border-slate-300",
                      )}
                    >
                      {values.imagesEvent?.[0] ? (
                        <>
                          <img
                            src={values.imagesEvent[0]}
                            className="absolute inset-0 h-full w-full object-cover opacity-50"
                            alt="Cover"
                          />
                          <div className="relative flex flex-col items-center text-blue-600">
                            <CheckCircle2 className="mb-1 h-6 w-6" />
                            <span className="text-[10px] font-bold uppercase">
                              Change Cover
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="mb-1 h-6 w-6 text-slate-400" />
                          <span className="text-[10px] text-slate-400">
                            Upload Main Cover
                          </span>
                        </>
                      )}
                    </div>
                    <ErrorMessage
                      name="imagesEvent"
                      component="div"
                      className="text-[10px] text-red-500"
                    />
                  </div>
                </div>

                <div className="mt-4 items-center gap-2 space-y-1 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <span className="font-bold text-blue-800">Note:</span>
                  <div className="text-sm text-blue-700">
                    1 Recommended size: 1600 x 900px
                  </div>
                  <div className="text-sm text-blue-700">
                    2 Aspect Ratio 16:9
                  </div>
                  <div className="text-sm text-blue-700">
                    3 Maximum file size: 1MB
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={onBack}
                  className="border bg-white px-8"
                >
                  Back
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={onBack}
                    className="border-slate-200 bg-white px-8 text-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 px-8 text-white hover:bg-blue-700"
                  >
                    Next: Tickets
                  </Button>
                </div>
              </div>
            </div>

          </Form>
        );
      }}
    </Formik>
  );
}
