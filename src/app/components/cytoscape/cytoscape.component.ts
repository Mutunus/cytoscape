import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';

// declare var cytoscape: any;

@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css']
})
export class CytoscapeComponent implements OnInit {

  cy

  constructor() { }

  ngOnInit() {
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      elements: {
        nodes: [
          {
            data: { id: 'c' }
          },
          {
            data: { id: 'a', parent: 'c' }
          },

          {
            data: { id: 'b', type: 'shittyNode' }
          }
        ],
        edges: [
          {
            data: { id: 'ab', source: 'a', target: 'b' }
          },
          {
            data: { id: 'ac', source: 'a', target: 'c' }
          }
        ]
      },

      layout: {
        name: 'grid',
        rows: 1
      },

      // so we can see the ids
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(id)'
          }
        },
        {
          selector: '.yep',
          style: {
            'line-color': 'red'
          }
        }
      ]
    });

    // add a node with a custom 'type' property. this property can later be used to identify this node.
    this.cy.add({
      group: 'nodes',
      data: { weight: 75, id: 'heybro', type: 'shittyNode' },
      position: { x: 400, y: 400 }
    });

    const array = [30,50,50,20]
    array.forEach((x, i) => {
      this.cy.add({
        group: 'nodes',
        data: { id: x, weight: 10 },
        position: { x: 50 + x * i, y: 100 + x * i }
      });
    })

    this.addEventListeners()

  }

  addNodes() {
    this.cy.add([
      { group: 'nodes', data: { id: 'n0' }, position: { x: 400, y: 200 } },
      { group: 'nodes', data: { id: 'n1' }, position: { x: 600, y: 200 } },
      { group: 'edges', data: { id: 'e0', source: 'n0', target: 'n1' } }
    ]);
  }

  addNode(id) {
    return this.cy.add({
      group: 'nodes', data: { id, boolean: true },
      position: { x: 550, y: 250 }
    })
  }

  removeNodes() {
    this.cy.remove('node[type = shittyNode]')
   // this.cy.remove('node[weight > 50]');

  }

  removeNodesWithType(type) {
    const nodesWithType = this.cy.nodes(`node[type = '${type}']`);
    nodesWithType.remove()
  }

  getNodesWithTypeAndWeight(type, weight) {
    this.cy.filter((element, i) => {
      return element.data('type') === type && element.data('weight') > weight;
    })
  }

  addEventListeners() {
    const nodeId = '12345'
    this.addNode(nodeId);

    this.cy.on('tap', `node[id = ${nodeId}]`, (e) => {
      console.log('node tap', e.target.data());
    })

    // hold shift to draw box
    this.cy.on('boxstart', e => console.log('box start', e));
    this.cy.on('boxend', e => console.log('box end', e))
    this.cy.on('boxselect', e => console.log('box boxselect', e.target.data()))
    this.cy.on('box', e => console.log('box', e.target.data()))

  }


  getElementById(id) {
    // get a node that has a specified id
    return this.cy.getElementById('12345234234234');
  }

  changeNodeStyle() {
    // batch means that the node will only be redrawn once
    this.cy.batch(function(){
      this.cy.$('#j')
        .data('weight', '70')
        .addClass('funny')
        .removeClass('serious')
      ;
    });
  }

  centre() {
    this.cy.centre()
  }

  animateLink() {

    const link = this.cy.getElementById('ab');

    setInterval(() => {
      link.toggleClass('yep')
    },500)


  }

  animate() {

    const nodes = this.cy.collection('node[weight = 10]')

    this.cy.animate({
      center: { eles: nodes },
      zoom: 2
    }, {
      duration: 1000
    });
  }

  toPng() {
    this.cy.png()
  }

  mountMapToOtherElement() {
    const el = document.getElementById('other-cy');
    this.cy.mount(el);
  }

  getMapData() {
    this.cy.data({bro: 1, mumpo: 'ohmy'})
    this.cy.data('yep', false)
    console.log(this.cy.data());
  }

  toggleSelectionType() {
    const currentType = this.cy.selectionType()
    this.cy.selectionType(currentType === 'single' ? 'additive' : 'single')

  }

}
