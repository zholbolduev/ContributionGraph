import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ContributionGraph.scss";

interface ContributionData {
  date: string;
  count: number;
}

const ContributionGraph: React.FC = () => {
  const [data, setData] = useState<ContributionData[]>([]);
  const [hoveredItem, setHoveredItem] = useState<ContributionData | null>(null);

  const handleItemHover = (item: ContributionData | null) => {
    setHoveredItem(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dpg.gg/test/calendar.json");
        const dataArray: ContributionData[] = Object.entries(response.data).map(
          ([date, count]) => ({
            date,
            count: Number(count),
          })
        );
        setData(dataArray);
      } catch (error) {
        console.error("Error fetching contribution data:", error);
      }
    };

    fetchData();
  }, []);

  const renderGraph = () => {
    if (!Array.isArray(data)) {
      return <div>Error: Invalid data format</div>;
    }

    return (
      <div className="graph-container">
        {data.map((item) => (
          <div
            key={item.date}
            className={`contrib-block ${getContribColor(item.count)}`}
            title={`Contributions: ${item.count}`}
            onMouseEnter={() => handleItemHover(item)}
            onMouseLeave={() => handleItemHover(null)}
          ></div>
        ))}
      </div>
    );
  };

  const getContribColor = (count: number): string => {
    if (count === 0) return "no-contrib";
    else if (count >= 1 && count <= 9) return "low-contrib";
    else if (count >= 10 && count <= 19) return "mid-contrib";
    else if (count >= 20) return "high-contrib";
    else return "max-contrib";
  };

  return (
    <div className="contribution-graph">
      {renderGraph()}
      {hoveredItem && (
        <div className="tooltip">
          <React.Fragment>
            <h2>Hovered Item Details:</h2>
            <p className="contribution-details">Date: {hoveredItem.date}</p>
            <p className="contribution-details">
              Contributions: {hoveredItem.count}
            </p>
          </React.Fragment>
        </div>
      )}
    </div>
  );
};

export default ContributionGraph;
