// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import FileInput from "@/components/FileInput";
import FormField from "@/components/FormField";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE, visibilities } from "@/constants";
import {
	getthumbnailUploadUrl,
	getVideoUploadUrl,
	saveVideoDetails,
} from "@/lib/actions/video";
import { useFileInput } from "@/lib/hooks/useFileInput";
import { useRouter } from "next/navigation";
import React, {
	ChangeEvent,
	FormEvent,
	useActionState,
	useEffect,
	useState,
	useTransition,
} from "react";

const uploadFileToBunny = async (
	file: File,
	uploadUrl: string,
	accessKey: string
): Promise<void> => {
	const response = await fetch(uploadUrl, {
		method: "PUT",
		headers: {
			"Content-Type": file.type,
			AccessKey: accessKey,
		},
		body: file,
	});
	if (!response.ok) throw new Error("Upload failed");
};

const page = () => {
	const router = useRouter();

	const [videoDuration, setVideoDuration] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const video = useFileInput(MAX_VIDEO_SIZE);
	const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);
	const [formData, setFormData] = useState<VideoFormValues>({
		title: "",
		description: "",
		tags: "",
		visibility: "public",
	});
	const [isSubmitting, startSubmit] = useTransition();

	const handleInputChange = (
		e: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			if (!video.file || !thumbnail.file) {
				setError("Please upload video and thumbnail");
				return;
			}

			if (!formData.title || !formData.description) {
				setError("Please fill in all the details");
				return;
			}

			startSubmit(async () => {
				// 1. get upload url
				const {
					videoId,
					uploadUrl: videoUploadUrl,
					accessKey: videoAccessKey,
				} = await getVideoUploadUrl();
				if (!videoUploadUrl || !videoAccessKey)
					throw new Error("Failed to get video upload credentials");

				// 2. Upload the video to Bunny
				await uploadFileToBunny(
					video.file!,
					videoUploadUrl,
					videoAccessKey
				);

				// Upload the thumbnail to DB
				const {
					uploadUrl: thumbnailUploadUrl,
					accessKey: thumbnailAccessKey,
					cdnUrl: thumbnailCdnUrl,
				} = await getthumbnailUploadUrl(videoId);
				if (
					!thumbnailUploadUrl ||
					!thumbnailAccessKey ||
					!thumbnailCdnUrl
				)
					throw new Error(
						"Failed to get thumbnail upload credentials"
					);

				// Attach thumbnail
				await uploadFileToBunny(
					thumbnail.file!,
					thumbnailUploadUrl,
					thumbnailAccessKey
				);

				// Create a new DB entry for the video details (urls, data)
				await saveVideoDetails({
					videoId,
					thumbnailUrl: thumbnailCdnUrl,
					...formData,
					visibility: formData.visibility as Visibility,
					duration: videoDuration,
				});

				router.push(`/`);
			});
		} catch (error) {
			console.error("Error submitting form: ", error);
		}
	};

	useEffect(() => {
		if (video.duration !== null || video.duration !== 0) {
			setVideoDuration(video.duration);
		}
	}, [video.duration]);

	useEffect(() => {
		const checkForRecordedVideo = async () => {
			try {
				const stored = sessionStorage.getItem("recordedVideo");
				if (!stored) return;
				const { name, url, type, duration } = JSON.parse(stored);
				const blob = await fetch(url).then((res) => res.blob());
				const file = new File([blob], name, {
					type,
					lastModified: Date.now(),
				});

				if (video.inputRef.current) {
					const dataTransfer = new DataTransfer();
					dataTransfer.items.add(file);
					video.inputRef.current.files = dataTransfer.files;

					const event = new Event("change", { bubbles: true });
					video.inputRef.current.dispatchEvent(event);

					video.handleFileChange({
						target: {
							files: dataTransfer.files,
						},
					} as ChangeEvent<HTMLInputElement>);
				}

				if (duration) setVideoDuration(duration);

				sessionStorage.removeItem("recordedVideo");
				URL.revokeObjectURL(url);
			} catch (e) {
				console.error(e, "Error loading recorded video");
			}
		};

		checkForRecordedVideo();
	}, []);

	return (
		<main className="wrapper-md upload-page">
			<h1>Upload a video</h1>
			{error && <div className="error-field">{error}</div>}
			<form
				className=" rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"
				onSubmit={onSubmit}
			>
				<FormField
					id="title"
					label="Title"
					value={formData.title}
					placeholder="Enter a clear and concise video title"
					onChange={handleInputChange}
				/>
				<FormField
					id="description"
					label="Description"
					value={formData.description}
					placeholder="Describe what this video is about"
					as="textarea"
					onChange={handleInputChange}
				/>
				<FileInput
					id="videos"
					label="Video"
					accept="video/*"
					file={video.file}
					previewUrl={video.previewUrl}
					inputRef={video.inputRef}
					onChange={video.handleFileChange}
					onReset={video.resetFIle}
					type="video"
				/>
				<FileInput
					id="thumbnail"
					label="Thumbnail"
					accept="image/*"
					file={thumbnail.file}
					previewUrl={thumbnail.previewUrl}
					inputRef={thumbnail.inputRef}
					onChange={thumbnail.handleFileChange}
					onReset={thumbnail.resetFIle}
					type="image"
				/>
				<FormField
					id="visibility"
					label="Visibility"
					value={formData.visibility}
					as="select"
					options={[
						{
							value: "public",
							label: "Public",
						},
						{
							value: "private",
							label: "Private",
						},
					]}
					onChange={handleInputChange}
				/>

				<button
					type="submit"
					disabled={isSubmitting}
					className="submit-button"
				>
					{isSubmitting ? "Uploading..." : "Upload video"}
				</button>
			</form>
		</main>
	);
};

export default page;
