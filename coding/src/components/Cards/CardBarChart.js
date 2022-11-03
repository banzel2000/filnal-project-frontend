import React from "react";
import Chart from "chart.js";

export default function CardBarChart(dataMonthCountList) {
  React.useEffect(() => {
    console.log(">>>>>>>>>"+dataMonthCountList.data)
    if(dataMonthCountList.data == 1) {
      console.log(55555555)
    }
    new Chart(document.getElementById("bar-chart"), {
      type: 'bar',
      data: {
        labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค","มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.","พ.ย.", "ธ.ค."],
        datasets: [
          {
            label: "จำนวนกิจกรรม",
            borderColor: [
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(201, 203, 207, 0.2)', 
            ],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',

              'rgb(128, 128, 128)',
              'rgb(255, 209, 219)',
              'RGB(186, 226, 250)',
              'RGB(212, 225, 192)',
              'RGB(255, 239, 230)',
            ],
            data: [2478,5267,734,784,433,2478,5267,734,784,433,2478,5267]
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'จำนวนกิจกรรมทั้งหมดที่ได้รับชั่วโมงจิตอาสา กยศ.'
        }
      }
  });
  }, []);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
         
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative  ">
            <canvas id="bar-chart" ></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
