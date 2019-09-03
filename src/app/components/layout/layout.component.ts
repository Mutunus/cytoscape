import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';

// declare var cytoscape: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  cy

  constructor() { }

  ngOnInit() {

    const nodes = this.getNodes()
    const edges = this.createEdges(nodes)

    this.cy = cytoscape({
      container: document.getElementById('cy'),
      elements: {
        nodes,
        edges
      },

      layout: {
        name: 'cose',
        rows: 1
      },

      // so we can see the ids
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(id)'
          }
        }
      ]
    });

  }

  getNodes() {
    let nodes = []
    let total = 38
    for(let i = 0; i !== total; i++) {
      nodes.push({
        data: { id: i }
      })
    }
    return nodes
  }

  createEdges(nodes) {
    return nodes.reduce((acc, node, i) => {
      if(i % 3 === 0) {
        acc.push({
          data: { id: `${i}-${i + 1}`, source: i, target: i + 1 }
        })
      }
      if(i % 5 === 0) {
        acc.push({
          data: { id: `${i}-${i + 2}`, source: i, target: i + 2 }
        })
      }
      return acc
    }, [])
  }


}
