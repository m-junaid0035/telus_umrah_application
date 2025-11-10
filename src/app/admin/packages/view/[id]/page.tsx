import { fetchUmrahPackageByIdAction } from "@/actions/packageActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  hotels: { makkah?: string; madinah?: string };
  features?: string[];
  itinerary?: string[];
  includes?: string[];
  excludes?: string[];
  policies?: string[];
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

      <div className="space-y-4">
        {/* Package Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Package Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {pkg.name || "N/A"}
          </p>
        </div>

        {/* Price */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
          <p className="text-gray-700 dark:text-gray-300">{pkg.price ? `$${pkg.price}` : "N/A"}</p>
        </div>

        {/* Duration */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
          <p className="text-gray-700 dark:text-gray-300">{pkg.duration ? `${pkg.duration} days` : "N/A"}</p>
        </div>

        {/* Airline */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Airline</p>
          <p className="text-gray-700 dark:text-gray-300">{pkg.airline || "N/A"}</p>
        </div>

        {/* Departure City */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Departure City</p>
          <p className="text-gray-700 dark:text-gray-300">{pkg.departureCity || "N/A"}</p>
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
            <img src={pkg.image} alt={pkg.name} className="rounded-lg max-h-60 object-cover" />
          </div>
        )}

        {/* Travelers */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Travelers</p>
          <p className="text-gray-700 dark:text-gray-300">{pkg.travelers || "N/A"}</p>
        </div>

        {/* Rating */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
          <p className="text-gray-700 dark:text-gray-300">{pkg.rating ? `${pkg.rating} ★` : "N/A"}</p>
        </div>

        {/* Reviews */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Reviews</p>
          <p className="text-gray-700 dark:text-gray-300">{pkg.reviews || "N/A"}</p>
        </div>

        {/* Popular */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Popular</p>
          <p className="text-gray-700 dark:text-gray-300">{pkg.popular ? "Yes" : "No"}</p>
        </div>

        {/* Hotels */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hotels</p>
          <p className="text-gray-700 dark:text-gray-300">
            Makkah: {pkg.hotels?.makkah || "N/A"}, Madinah: {pkg.hotels?.madinah || "N/A"}
          </p>
        </div>

        {/* Multi-value fields */}
        {pkg.features && pkg.features.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Features</p>
            <ul className="text-gray-700 dark:text-gray-300 list-disc pl-5">
              {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Itineraries</p>
            <ul className="text-gray-700 dark:text-gray-300 list-disc pl-5">
              {pkg.itinerary.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
          </div>
        )}

        {pkg.includes && pkg.includes.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Includes</p>
            <ul className="text-gray-700 dark:text-gray-300 list-disc pl-5">
              {pkg.includes.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
          </div>
        )}

        {pkg.excludes && pkg.excludes.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Excludes</p>
            <ul className="text-gray-700 dark:text-gray-300 list-disc pl-5">
              {pkg.excludes.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
          </div>
        )}

        {pkg.policies && pkg.policies.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Policies</p>
            <ul className="text-gray-700 dark:text-gray-300 list-disc pl-5">
              {pkg.policies.map((p, idx) => <li key={idx}>{p}</li>)}
            </ul>
          </div>
        )}

        {/* Created At */}
        {pkg.createdAt && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
            <p className="text-gray-700 dark:text-gray-300">
              {new Date(pkg.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Updated At */}
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
  );
}
