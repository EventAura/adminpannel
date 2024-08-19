import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const BarChart = ({ data }) => {
    const chartRef = useRef(null);
    const myChartRef = useRef(null); // Store the chart instance

    useEffect(() => {
        if (chartRef.current) {
            // Destroy previous chart instance if it exists
            if (myChartRef.current) {
                myChartRef.current.destroy();
            }

            const ctx = chartRef.current.getContext("2d");

            const chartData = {
                labels: data.map((item) => new Date(item.date).toDateString()),
                datasets: [
                    {
                        label: "Participants",
                        data: data.map((item) => item.participants),
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Total Amount",
                        data: data.map((item) => item.amount),
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            };

            // Create a new chart instance
            myChartRef.current = new Chart(ctx, {
                type: "bar",
                data: chartData,
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }

        // Cleanup function to destroy the chart instance on component unmount
        return () => {
            if (myChartRef.current) {
                myChartRef.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

export default BarChart;
