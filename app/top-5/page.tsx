import TourCard from "@/components/ui/TourCard";

export default async function TopFive() {
  try {
    const res = await fetch(`${process.env.API_URL}/tours/top-five-tours`);
    const topFiveTours = await res.json();
    const tourCards = topFiveTours.data
      .sort((a: TourShort, b: TourShort) => b.ratingsAverage - a.ratingsAverage)
      .map((tour: TourShort) => <TourCard data={tour} key={tour._id} />);
    return (
      <div className="grid grid-cols-1 justify-items-center gap-1  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 ">
        {tourCards}
      </div>
    );
  } catch (err) {
    console.log(err);
    return <h1>Failed to fetch tours</h1>;
  }
}
