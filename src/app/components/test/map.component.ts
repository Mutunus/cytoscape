import {Component, OnInit} from '@angular/core';
import {Map} from 'leaflet';

declare let L;

@Component({
  selector: 'map-comp',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class TestComponent implements OnInit {
  title = 'leaflet-map-test';
  private map: Map;
  private detailLayers;
  nodes;
  links;

  polylines

  constructor() {
    this.nodes = [
      { id: 1, x: 35.36, y: -223.14, icon: '../assets/wireless-ap.svg', name: 'Real Nice Node' },
      { id: 2, x: 35.9, y: -220.28, icon: '../assets/Firewall.svg', name: 'Nice Node' }
    ];
    this.links = [
      { id: 3, src: [35.36, -223.14], dst: [35.9, -220.28] },
    ]
  }

  ngOnInit() {
    this.map = L.map('mapid', {
      renderer: L.canvas()
    }).setView([35, -222], 7)

    var myRenderer = L.canvas({ padding: 0.5 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.drawMap(this.nodes, this.links)

    this.map.on('move', this.onMove)

    this.map.on('zoom', this.onZoom)

    // this.map.on('zoom', (e) => {
    //   console.log(e.target._zoom, 'zoom');
    //   if (e.target._zoom < 14) {
    //     if (!removed) {
    //       this.detailLayers.map(layer => this.map.removeLayer(layer));
    //       removed = true;
    //     }
    //   } else {
    //     if (removed) {
    //       this.detailLayers.map(layer => this.map.addLayer(layer));
    //       removed = false;
    //     }
    //   }
    // });

    this.map.on('click', this.onMapClick);

  }

  drawMap(nodes = [], links = []) {
    this.drawTopology(nodes, links).map(layer => this.map.addLayer(layer));
  }

  private onMapClick = (e) => {
    console.log('onClick', e)
    const coords = e.latlng;
    const newNodes = [
      { x: coords.lat, y: coords.lng, icon: '../assets/Firewall.svg' }
    ]
    this.drawMap(newNodes);
  }

  private onZoom = (e) => {
    console.log('onZoom', e);
  }

  private onMove = (e) => {
    console.log('onMove', e);
  }

  private drawNodes(nodes: any[]) {
    const canvas = document.getElementsByTagName('canvas')[0];
    console.log(canvas)
    const ctx = canvas.getContext('2d');

    nodes.forEach(node => {
      const image = new Image()
      image.src = '../assets/wireless-ap.svg'
      image.onload = () => {
        ctx.drawImage(image, 250, 250)
      }
    })
  }

  onNodeDrag = (id) => (e) => {
    console.log('onNodeDrag', e)
    console.log(id);
    // TODO - update db with node coords
    const polyline = this.polylines[0]
    const link = this.links[0]

    console.log(link)

    const { lat, lng } = e.latlng
    const latLng = [lat, lng];
    polyline.setLatLngs([latLng, link.dst])

  }

  onNodeMoveEnd = id => e => {
    console.log('onNodeMoveEnd', id, e)
  }

  onNodeClick = (id, node) => (e) => {
    console.log('onNodeClick', id, e);
    alert(`You have clicked on: ${node.name}`);



  }

  private drawTopology(nodes: any[], links: any[]) {
    const nodeElements = nodes.map(node => {
      const icon = L.icon({
        iconUrl: node.icon,
        iconSize: [50, 30]
      });
      const coords = [node.x, node.y];
      const marker = L.marker(coords, {
        icon,
        bubblingMouseEvents: false,
        title: node.name,
        draggable: true,
        autoPan: true
      });
      marker.on('move', this.onNodeDrag(node.id));
      marker.on('moveend', this.onNodeMoveEnd(node.id))
      marker.on('click', this.onNodeClick(node.id, node))
      return marker;
    });

    const linkElements = links.map(link => {
      const polyline = L.polyline([link.src, link.dst], {color: 'blue'});
      return polyline
    })

    if(links.length) {
      this.polylines = linkElements
    }

    return [...nodeElements, ...linkElements];
  };

  getLinkLength = (link) => () => {
    const distance = this.map.distance(link.src, link.dst)
  }

  findUser() {
    this.map.on('locationfound', e => console.log(e))
    this.map.locate({ setView: true });


  }

  search(s) {
    const latLng = L.latLng(50.5, 30.5)
    this.map.flyTo(latLng, 8);
  }

}
