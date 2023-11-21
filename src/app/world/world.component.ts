import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html'
})

export class WorldComponent {
  // Content of the SVG file loaded in the loadSvgMap() function.
  public svgMapContent!: SafeHtml;

  // Properties of the country data object.
  countryName!: string;
  countryCapital!: string;
  countryRegion!: string;
  countryIncome!: string;
  countryPopulation!: number;
  countryGDP!: number;

  // Country data object.
  countryInfo: any = {};

  // Inject ApiService, HttpClient, DomSanitizer, ElementRef, and Renderer2 services.
  constructor(private apiService: ApiService, private http: HttpClient, private sanitizer: DomSanitizer,
     private el: ElementRef, private renderer: Renderer2) { }

  // Loading SVG map on component initialization.
  ngOnInit() {
    this.loadSvgMap();
  }

  // Getting SVG map from the assets folder.
  private loadSvgMap() {
    this.http.get('assets/world-map.svg', { responseType: 'text' }).subscribe(svgContent => {
      this.svgMapContent = this.sanitizer.bypassSecurityTrustHtml(svgContent);
      setTimeout(() => this.addHoverHandlers(), 0);
    });
  }

  // Adding hover handlers to the SVG map.
  private addHoverHandlers() {
    // Getting all the paths inside the SVG.
    const svg = this.el.nativeElement.querySelector('.map-column svg');
    if (svg) {
      const paths = svg.querySelectorAll('path');
      // Adding mouseenter and mouseleave event listeners to each path.
      paths.forEach((path: SVGPathElement) => {
        this.renderer.listen(path, 'mouseenter', (event) => this.onCountryHover(event));
        this.renderer.listen(path, 'mouseleave', (event) => {
          path.style.fill = ''; // Resetting color on mouse leave.
          this.clearCountryData();
        });
      });
    }
  }

  // Handling mouseenter event on the country path.
  private onCountryHover(event: Event) {
    const countryPath = event.target as SVGPathElement;
    const countryCode = countryPath.id;
    countryPath.style.fill = 'red'; // Setting color to red on hover.
    
    this.loadCountryData(countryCode);
    console.log('hovered');
  }
  
  // Clearing the country data.
  private clearCountryData() {
    this.countryInfo = {}; 
  }

  // Loading country data from the World Bank API.
  loadCountryData(countryCode: string) {
    this.apiService.getCountryDetails(countryCode).subscribe({
      next: response => {
        const countryData = response[1][0];
        this.countryInfo = {
          countryName: countryData.name.value,
          countryCapital: countryData.capitalCity.value,
          countryRegion: countryData.region.value,
          countryIncome: countryData.incomeLevel.value,
        };
        this.countryInfo = response[1][0];
        this.loadAdditionalData(countryCode);
        console.log(countryData);
      },
      error: error => console.error('Error fetching country details:', error),
      complete: () => { }
    });
  }

  // Loading additional data from the World Bank API.
  loadAdditionalData(countryCode: string) {

    // Getting population data.
    this.apiService.getAdditionalData(countryCode, 'SP.POP.TOTL').subscribe({
      next: data => {
        this.countryInfo.population = data[1][0].value;
      },
      error: error => console.error('Error fetching additional data:', error),
    });

    // Getting GDP data.
    this.apiService.getAdditionalData(countryCode, 'NY.GDP.MKTP.CD').subscribe({
      next: data => {
        this.countryInfo.gdp = data[1][0].value;
      },
      error: error => console.error('Error fetching additional data:', error),
    });
  }
}