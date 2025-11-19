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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {pkg.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Package Details
          </p>
        </div>
        <Link href="/admin/packages">
          <Button variant="secondary">Back to Packages</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
              <p className="text-gray-900 dark:text-gray-100 text-lg font-medium">
                {pkg.price ? `PKR ${pkg.price.toLocaleString()}` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-gray-900 dark:text-gray-100 text-lg font-medium">
                {pkg.duration ? `${pkg.duration} days` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Airline</p>
              <p className="text-gray-900 dark:text-gray-100">{pkg.airline || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Departure City</p>
              <p className="text-gray-900 dark:text-gray-100">{pkg.departureCity || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Travelers</p>
              <p className="text-gray-900 dark:text-gray-100">{pkg.travelers || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
              <p className="text-gray-900 dark:text-gray-100">
                {pkg.rating ? `${pkg.rating} ★` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reviews</p>
              <p className="text-gray-900 dark:text-gray-100">{pkg.reviews || "N/A"}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {pkg.badge && (
              <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                {pkg.badge}
              </span>
            )}
            {pkg.popular && (
              <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                Popular
              </span>
            )}
          </div>
        </div>

        {/* Image */}
        {pkg.image && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Package Image</h3>
            <img
              src={pkg.image}
              alt={pkg.name}
              className="rounded-lg max-h-96 w-full object-cover border"
            />
          </div>
        )}

        {/* Hotels */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Hotels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Makkah Hotel</p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {typeof pkg.hotels?.makkah === "object"
                  ? (pkg.hotels.makkah as IHotel).name
                  : pkg.hotels?.makkah || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Madinah Hotel</p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {typeof pkg.hotels?.madinah === "object"
                  ? (pkg.hotels.madinah as IHotel).name
                  : pkg.hotels?.madinah || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        {pkg.features && pkg.features.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <div className="flex flex-wrap gap-2">
              {pkg.features.map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-sm"
                >
                  {typeof f === "object" ? (f as IFeature).feature_text : f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Itinerary</h3>
            <ul className="space-y-2">
              {pkg.itinerary.map((i, idx) => (
                <li key={idx} className="text-gray-900 dark:text-gray-100">
                  <span className="font-medium">{typeof i === "object" ? (i as IItinerary).title : i}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Includes */}
        {pkg.includes && pkg.includes.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Includes</h3>
            <ul className="space-y-1">
              {pkg.includes.map((i, idx) => (
                <li key={idx} className="text-gray-900 dark:text-gray-100 flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{typeof i === "object" ? (i as IInclude).include_text : i}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Excludes */}
        {pkg.excludes && pkg.excludes.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Excludes</h3>
            <ul className="space-y-1">
              {pkg.excludes.map((e, idx) => (
                <li key={idx} className="text-gray-900 dark:text-gray-100 flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>{typeof e === "object" ? (e as IExclude).exclude_text : e}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Policies */}
        {pkg.policies && pkg.policies.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Policies</h3>
            <ul className="space-y-2">
              {pkg.policies.map((p, idx) => (
                <li key={idx} className="text-gray-900 dark:text-gray-100">
                  <span className="font-medium">{typeof p === "object" ? (p as IPolicy).heading : p}</span>
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
