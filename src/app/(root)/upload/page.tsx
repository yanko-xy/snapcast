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
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

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

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [videoDuration, setVideoDuration] = useState(0);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		visibility: "public",
	});
	const video = useFileInput(MAX_VIDEO_SIZE);
	const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);
	const [error, setError] = useState("");

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setIsSubmitting(true);

		try {
			if (!video.file || !thumbnail.file) {
				setError("Please upload  video and thumbnail");
				return;
			}
			if (!formData.title || !formData.description) {
				setError("Please fill in all the details");
				return;
			}

			// 1. get upload url
			const {
				videoId,
				uploadUrl: videoUploadUrl,
				accessKey: videoAccessKey,
			} = await getVideoUploadUrl();
			if (!videoUploadUrl || !videoAccessKey)
				throw new Error("Failed to get video upload credentials");

			// 2. Upload the video to Bunny
			await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);

			// Upload the thumbnail to DB
			const {
				uploadUrl: thumbnailUploadUrl,
				accessKey: thumbnailAccessKey,
				cdnUrl: thumbnailCdnUrl,
			} = await getthumbnailUploadUrl(videoId);
			if (!thumbnailUploadUrl || !thumbnailAccessKey || !thumbnailCdnUrl)
				throw new Error("Failed to get thumbnail upload credentials");

			// Attach thumbnail
			await uploadFileToBunny(
				thumbnail.file,
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

			router.push(`/video/${videoId}`);
		} catch (error) {
			console.error("Error submitting form: ", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (video.duration !== null || video.duration !== 0) {
			setVideoDuration(video.duration);
		}
	}, [video.duration]);

	return (
		<main className="wrapper-md upload-page">
			<h1>Upload a video</h1>
			{error && <div className="error-field">{error}</div>}
			<form
				className=" rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"
				onSubmit={handleSubmit}
			>
				<FormField
					id="title"
					label="Title"
					placeholder="Enter a clear and concise video title"
					value={formData.title}
					onChange={handleInputChange}
				/>
				<FormField
					id="description"
					label="Description"
					placeholder="Describe what this video is about"
					as="textarea"
					value={formData.description}
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
					value={formData.visibility}
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
