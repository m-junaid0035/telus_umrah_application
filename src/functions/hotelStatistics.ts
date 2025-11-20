"use server";

import { connectToDatabase } from "@/lib/db";
import { Hotel, HotelType } from "@/models/Hotel";

/**
 * Get hotel statistics
 */
export const getHotelStatistics = async () => {
  await connectToDatabase();
  
  const totalHotels = await Hotel.countDocuments();
  
  // Hotels by type
  const makkahHotels = await Hotel.countDocuments({ type: HotelType.Makkah });
  const madinaHotels = await Hotel.countDocuments({ type: HotelType.Madina });
  
  // Hotels by star rating
  const star3Hotels = await Hotel.countDocuments({ star: 3 });
  const star4Hotels = await Hotel.countDocuments({ star: 4 });
  const star5Hotels = await Hotel.countDocuments({ star: 5 });
  
  // Hotels created in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentHotels = await Hotel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
  
  // Hotels by month (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - i);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    
    const count = await Hotel.countDocuments({
      createdAt: { $gte: monthStart, $lt: monthEnd }
    });
    
    monthlyData.push({
      month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
      count
    });
  }
  
  return {
    totalHotels,
    makkahHotels,
    madinaHotels,
    star3Hotels,
    star4Hotels,
    star5Hotels,
    recentHotels,
    monthlyData,
  };
};

