import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import { getAllVideos } from "@/lib/actions/video";
import Image from "next/image";

const Page = async ({ searchParams }: SearchParams) => {
	const { query, filter, page } = await searchParams;
	const { videos, pagination } = await getAllVideos(
		query,
		filter,
		Number(page || 1)
	);
	return (
		<main className="wrapper page">
			<Header title="All Videos" subHeader="Public Library" />

			{videos?.length > 0 ? (
				<section className="video-grid">
					{videos[0].video.title}
					{/* {dummyCards.map((card) => (
						<VideoCard
							key={card.id}
							{...card}
							visibility={card.visibility as Visibility}
						/>
					))} */}
				</section>
			) : (
				<div>EMPTY</div>
			)}
		</main>
	);
};

export default Page;
