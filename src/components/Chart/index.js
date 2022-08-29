import ApexChart from "react-apexcharts";

/***
 * props:
 * - data
 */

export function ChartAbastLitro(props) {
  var colorPalette = ["#00D8B6", "#008FFB", "#FEB019", "#FF4560", "#775DD0", '#2b908f'];
  const options = {
    xaxis: {
      categories: props.dataveiculo,
      labels: {
        style: {
          colors: colorPalette,
          fontSize: '12px'
        }
      }
    },
   
    colors: colorPalette,
    plotOptions: {
      bar: {
        columnWidth: '65%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: true
    },
    legend: {
      show: false
    },
    title: {
      text: 'Abastecimento em Litros',
      align: 'left',
      style: {
        fontSize: '15px'
      }
    }
  };

  const series = [
    {
      name: "Consumo",
      data: props.datalitro,
    },
  ];

  return (
    <ApexChart
      options={options}
      series={series}
      type="bar"
      width={540}
      height={380}
    />
  );
}

export function ChartAbastValor(props) {
  var colorPalette = ["#00D8B6", "#008FFB", "#FEB019", "#FF4560", "#775DD0", '#2b908f'];

  const options = {
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        donut: {
          size: "75%",
        },
        offsetY: 20,
      },
      stroke: {
        colors: undefined,
      },
    },
    colors: colorPalette,
    title: {
      text: "Abastecimento em Reais",
      style: {
        fontSize: "15px",
      },
    },

    labels: props.dataveiculo,
    legend: {
      position: "left",
      offsetY: 80,
    },
  };

  const series = props.datalitro;

  return (
    <ApexChart
      options={options}
      series={series}
      type="donut"
      width={540}
      height={380}
    />
  );
}

export function ChartOdmetro(props) {

  const options = {
    
    plotOptions: {
      bar: {
        barHeight: '100%',
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom'
        },
      }
    },
    colors: ["#00D8B6", "#008FFB", "#FEB019", "#FF4560", "#775DD0", '#2b908f', '#f9a3a4', '#90ee7e',
      '#f48024', '#69d2e7'
    ],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff']
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
      },
      offsetX: 0,
      dropShadow: {
        enabled: true
      }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: props.dataveiculo,
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    title: {
        text: 'Quilômetros Rodados',
        align: 'left',
        floating: true
    },   
    tooltip: {
      theme: 'dark',
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function () {
            return ''
          }
        }
      }
    }
  };

  const series = [
    {
      data: props.datalitro
    }
  ];

  return <ApexChart 
  options={options} 
  series={series}  
  type="bar"
  width={540}
  height={380} />;
}