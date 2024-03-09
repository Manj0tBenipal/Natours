import TourCard from "@/components/ui/TourCard";

export default async function Tours() {
  try {
    /*
     * Only selecting those fields that are needed in the card
     */
    const toursRes = await fetch(
      `${process.env.API_URL}/tours?fields=imageCover,ratingsAverage,summary,name,difficulty,price`
    );
    const res = await toursRes.json();
    if (res.status === "fail") throw new Error("Something went wrong");
    if (res.data.length === 0) return <div>No results found</div>;
    const tours = res.data;
    const cards = tours.map((tour: TourShort) => {
      return <TourCard key={tour._id} data={tour} />;
    });
    return (
      <div className="grid grid-cols-1 justify-items-center gap-1  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 ">
        {cards}
      </div>
    );
  } catch (err) {
    return <div>Somehting went wrong</div>;
  }
}
