import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import { getAllVideos } from "@/lib/actions/video";
import { useTranslation } from "@/lib/i18n";
import { withI18N } from "@/wrapper/I18NWrapper";
import { headers } from "next/headers";
import Image from "next/image";

const Page = async (
	{ searchParams, params }: SearchParams,
	t: I18NFunction
) => {
	const { query, filter, page } = await searchParams;
	const { videos, pagination } = await getAllVideos(
		query,
		filter,
		Number(page || 1)
	);
	return (
		<main className="wrapper page">
			<Header title={t("home.title")} subHeader={t("home.subtitle")} />

			{videos?.length > 0 ? (
				<section className="video-grid">
					{videos.map(({ video, user }) => (
						<VideoCard
							key={video.id}
							{...video}
							thumbnail={video.thumbnailUrl}
							userImg={user?.image || ""}
							username={user?.name || "XY"}
						/>
					))}
				</section>
			) : (
				<EmptyState
					icon="/assets/icons/video.svg"
					title="No Videos Found"
					description="Try adjusting your search"
				/>
			)}
		</main>
	);
};

export default withI18N(Page);
