import { Component, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Plot from "@observablehq/plot";
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';


@Component({
  selector: 'app-charting',
  imports: [CommonModule],
  templateUrl: './charting.component.html',
  styleUrl: './charting.component.css'
})
export class ChartingComponent {
  showPenguinCharts: boolean = false;
  showTrafficCharts: boolean = false;
  showOlympicCharts: boolean = false;
  showOlympicScatter: boolean = false;
  showOlympicBar: boolean = false;

  //ViewChild is used to access the div in the DOM after view initialization => plotContainer is initialized after the browser has been loaded
  @ViewChild('plotContainer', { static: true }) plotContainer!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  //ObservablePlot is only used client-side, and therefore can't be rendered server-side. Since it uses DOM APIs, these aren't available until the browser is rendered
  
  togglePenguin() {
    this.plotContainer.nativeElement.innerHTML = '';
    this.showPenguinCharts = !this.showPenguinCharts;
    this.showOlympicCharts = false;
    this.showTrafficCharts = false;
    this.showOlympicBar = false;
    this.showOlympicScatter = false;
  }

  toggleOlympics() {
    this.plotContainer.nativeElement.innerHTML = '';
    this.showOlympicCharts = !this.showOlympicCharts;
    this.showPenguinCharts = false;
    this.showTrafficCharts = false;
  }

  getPenguinCharts(y_label: string, color: string) {
    if (this.showPenguinCharts) {
      if (isPlatformBrowser(this.platformId)){ //isPlatformBrowser() ensures the chart is only rendered on the client
        fetch('data/penguins_with_labels.csv')
          .then(res => res.text())
          .then(data => {
            const penguinData = d3.csvParse(data);
            const plot = Plot.plot({
              color: {legend: true},
              marks: [
                Plot.rectY(penguinData, 
                  Plot.binX(
                    {
                      y2: "count"
                    }, 
                    {
                      x: y_label, 
                      fill: "species"
                    } as any
                  )),  
              ],
              height: 300,
              width: 500
            });
            
            this.plotContainer.nativeElement.appendChild(plot);
          }); 
      }
    } else {
      this.plotContainer.nativeElement.innerHTML = '';
    }
  }

  getTrafficCharts() {
    this.showTrafficCharts = !this.showTrafficCharts;
    this.showOlympicCharts = false;
    this.showPenguinCharts = false;
    this.showOlympicBar = false;
    this.showOlympicScatter = false;
    this.plotContainer.nativeElement.innerHTML = '';
    if (this.showTrafficCharts) {
      if (isPlatformBrowser(this.platformId)){
        fetch('data/traffic_weekly.csv')
            .then(res => res.text())
            .then(data => {
              const trafficData = d3.csvParse(data, d => ({
                date: +d['date'],               
                coordinates: `${d['lat']}, ${d['lng']}`,
                vehicles: +d['total_1'] + +d['total_2'] + +d['truck_1'] + +d['truck_2'],
                location: d['name'],
              }));
              const plot = Plot.plot({
                marginLeft: 120,
                padding: 0,
                y: {label: null},
                color: {scheme: "turbo", legend: true, zero: true},
                marks: [
                  Plot.cell(
                    trafficData,
                    Plot.group(
                      {fill: "median"}, //this first groups the x axis and finds the median number of vehicles for each <location, hour> pair
                      { //this second part tells the plot how to group the data before the above fill is applied 
                        x: d => new Date(d.date * 1000).getUTCHours(), //group by hour
                        y: "location", //group by location
                        fill: "vehicles", //this is telling the above fill what column to calculate the median on
                        inset: 0.5, 
                        sort: {y: "fill"}
                      }
                    )
                  )
                ]
              });
              
              this.plotContainer.nativeElement.appendChild(plot);
            }); 
        }
     } else {
      this.plotContainer.nativeElement.innerHTML = '';
     }
  }
  
  getOlympicScatterChart() {
    this.showOlympicScatter = !this.showOlympicScatter;
    this.showOlympicBar = false;
    if (this.showOlympicCharts && this.showOlympicScatter) {
      if (isPlatformBrowser(this.platformId)){
        this.plotContainer.nativeElement.innerHTML = '';
        fetch('data/athletes.csv')
            .then(res => res.text())
            .then(data => {
              const olympicData = d3.csvParse(data, d => ({
                name: d['name'],
                nationality: d['nationality'],
                height: +d['height'],
                weight: +d['weight'],
                sport: d['sport'],
                sex: d['sex'],
              }));
              console.log(olympicData);
              const plot = Plot.dot(olympicData, {
                x: "weight",
                y: "height",
                stroke: "sex",
                channels: {name: "name", sport: "sport"},
                tip: true
              }).plot()
              
              this.plotContainer.nativeElement.appendChild(plot);
            }); 
      }
    } else {
      this.plotContainer.nativeElement.innerHTML = '';
    }
  }

  getOlympicBarChart() {
    this.showOlympicBar = !this.showOlympicBar;
    this.showOlympicScatter = false;
    if (this.showOlympicCharts && this.showOlympicBar) {
      if (isPlatformBrowser(this.platformId)){
        this.plotContainer.nativeElement.innerHTML = '';
        fetch('data/athletes.csv')
            .then(res => res.text())
            .then(data => {
              const olympicData = d3.csvParse(data, d => ({
                name: d['name'],
                nationality: d['nationality'],
                height: +d['height'],
                weight: +d['weight'],
                sport: d['sport'],
                sex: d['sex'],
              }));
              const plot = Plot.plot({
                fx: {padding: 0, label: null, tickRotate: 90, tickSize: 6},
                x: {axis: null},
                y: {grid: true},
                color: {legend: true},
                marks: [
                  Plot.barY(olympicData, Plot.groupX({y2: "count"}, {x: "sex", fx: "sport", fill: "sex"})),
                  Plot.ruleY([0])
                ]
              })
              
              this.plotContainer.nativeElement.appendChild(plot);
            }); 
      }
    } else {
      this.plotContainer.nativeElement.innerHTML = '';
    }
  }

}
