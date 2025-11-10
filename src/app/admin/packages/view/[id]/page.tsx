import { fetchUmrahPackageByIdAction } from "@/actions/packageActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface IHotel {
  _id: string;
  name: string;
  type: "Makkah" | "Madina";
}

interface IFeature {
  _id: string;
  feature_text: string;
}

interface IItinerary {
  _id: string;
  title: string;
}

interface IInclude {
  _id: string;
  include_text: string;
}

interface IExclude {
  _id: string;
  exclude_text: string;
}

interface IPolicy {
  _id: string;
  heading: string;
}

interface IUmrahPackage {
  _id: string;
  name: string;
  price: number;
  duration: number;
  airline: string;
  departureCity: string;
  badge?: string;
  image?: string;
  travelers: number;
  rating?: number;
  reviews?: number;
  popular?: boolean;
  hotels: {
    makkah?: IHotel | string;
    madinah?: IHotel | string;
  };
  features?: (IFeature | string)[];
  itinerary?: (IItinerary | string)[];
  includes?: (IInclude | string)[];
  excludes?: (IExclude | string)[];
  policies?: (IPolicy | string)[];
  createdAt?: string;
  updatedAt?: string;
}

export default async function PackageViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchUmrahPackageByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const pkg: IUmrahPackage = result.data;
  console.log("Package Data:", pkg);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          View Umrah Package
        </h2>
        <Link href="/admin/packages">
          <Button variant="secondary">Back to Packages</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Package Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Package Name</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pkg.name}</p>
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
            <p className="text-gray-700 dark:text-gray-300">
              {pkg.price ? `$${pkg.price}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
            <p className="text-gray-700 dark:text-gray-300">
              {pkg.duration ? `${pkg.duration} days` : "N/A"}
            </p>
          </div>
        </div>

        {/* Airline & Departure */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Airline</p>
            <p className="text-gray-700 dark:text-gray-300">{pkg.airline || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Departure City</p>
            <p className="text-gray-700 dark:text-gray-300">{pkg.departureCity || "N/A"}</p>
          </div>
        </div>

        {/* Badge */}
        {pkg.badge && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Badge</p>
            <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
              {pkg.badge}
            </span>
          </div>
        )}

        {/* Image */}
        {pkg.image && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Image</p>
            <img
              src={pkg.image}
              alt={pkg.name}
              className="rounded-lg max-h-60 object-cover border"
            />
          </div>
        )}

        {/* Travelers, Rating, Reviews */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Travelers</p>
            <p className="text-gray-700 dark:text-gray-300">{pkg.travelers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
            <p className="text-gray-700 dark:text-gray-300">
              {pkg.rating ? `${pkg.rating} ★` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Reviews</p>
            <p className="text-gray-700 dark:text-gray-300">{pkg.reviews || "N/A"}</p>
          </div>
        </div>

        {/* Popular */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Popular</p>
          {pkg.popular ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium dark:bg-green-800 dark:text-green-100">
              Yes
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium dark:bg-red-800 dark:text-red-100">
              No
            </span>
          )}
        </div>

        {/* Hotels */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hotels</p>
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Makkah:</strong>{" "}
              {typeof pkg.hotels?.makkah === "object"
                ? (pkg.hotels.makkah as IHotel).name
                : pkg.hotels?.makkah || "N/A"}
            </p>
            <p>
              <strong>Madinah:</strong>{" "}
              {typeof pkg.hotels?.madinah === "object"
                ? (pkg.hotels.madinah as IHotel).name
                : pkg.hotels?.madinah || "N/A"}
            </p>
          </div>
        </div>

        {/* Features */}
        {pkg.features && pkg.features.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Features</p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {pkg.features.map((f, i) => (
                <li key={i}>
                  {typeof f === "object" ? (f as IFeature).feature_text : f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Itinerary */}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Itinerary</p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {pkg.itinerary.map((i, idx) => (
                <li key={idx}>
                  {typeof i === "object" ? (i as IItinerary).title : i}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Includes */}
        {pkg.includes && pkg.includes.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Includes</p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {pkg.includes.map((i, idx) => (
                <li key={idx}>
                  {typeof i === "object" ? (i as IInclude).include_text : i}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Excludes */}
        {pkg.excludes && pkg.excludes.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Excludes</p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {pkg.excludes.map((e, idx) => (
                <li key={idx}>
                  {typeof e === "object" ? (e as IExclude).exclude_text : e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Policies */}
        {pkg.policies && pkg.policies.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Policies</p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {pkg.policies.map((p, idx) => (
                <li key={idx}>
                  {typeof p === "object" ? (p as IPolicy).heading : p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Created & Updated Dates */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {pkg.createdAt && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(pkg.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          {pkg.updatedAt && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(pkg.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
