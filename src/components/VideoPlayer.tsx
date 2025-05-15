// Copyright (c) 2025 yanko
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { createIframeLink } from "@/lib/utils";
import React from "react";

const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
	return (
		<div className="video-player">
			<iframe
				src={createIframeLink(videoId)}
				loading="lazy"
				title="Video player"
				style={{ border: 0, zIndex: 50 }}
				allowFullScreen
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			/>
		</div>
	);
};

export default VideoPlayer;
