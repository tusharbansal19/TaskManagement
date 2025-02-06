import React from "react";
import { useMediaQuery } from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

// Updated colors based on the line chart
const COLORS = ["#8E44AD", "#3498DB"]; // Purple for Completed, Blue for Incomplete

const PieChartCard = ({ pieData }) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Chart size adjustments
  const chartSize = isSmallScreen ? 180 : 350; 
  const outerRadius = isSmallScreen ? 60 : 120;

  return (
    <>
      <div className="bg-[#2C2B5A] text-white max-w-[90%] mx-auto md:max-w-full p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 w-full">
        <div className="flex flex-col items-center">
          {/* Title */}
          <h2 className={`font-bold ${isSmallScreen ? "text-sm" : "text-md"} mb-4 underline`}>
            Task Completion Breakdown
          </h2>

          {/* Pie Chart */}
          <div className="flex justify-center items-center w-full overflow-hidden text-[0.75rem] min-h-[250px]">
            <PieChart width={chartSize} height={chartSize}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                dataKey="value"
                label={({ percent }) => ` ${(percent * 100).toFixed(0)}% `}
                labelLine={false}
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* Responsive Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#3B3B80",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: isSmallScreen ? "0.6rem" : "0.8rem",
                  padding: isSmallScreen ? "4px" : "8px",
                }}
                labelStyle={{ color: "white" }}
              />
              {/* Responsive Legend */}
              <Legend
                iconType="circle"
                layout={isSmallScreen ? "vertical" : "horizontal"}
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  color: "white",
                  fontSize: isSmallScreen ? "0.6rem" : "0.8rem",
                  marginTop: isSmallScreen ? "10px" : "15px",
                }}
              />
            </PieChart>
          </div>

          {/* Description */}
          <p className={`mt-4 ${isSmallScreen ? "text-center text-sm" : "text-left text-base"}`}>
            This chart represents the proportion of completed (purple) and incomplete (blue) tasks.
          </p>
        </div>
      </div>

      <div className="mt-10 hidden md:inline-block h-[5px] w-full bg-[#2C2B5A] rounded-full"></div>
    </>
  );
};

export default PieChartCard;
